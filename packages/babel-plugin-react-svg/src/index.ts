import { NodePath, PluginObj, PluginPass } from '@babel/core'
import * as t from '@babel/types'
import { hyphenToCamel, namespaceToCamel } from './camelize'
import cssToObj from './css-to-obj'

export type Opts = { componentName?: string }

export default function (): PluginObj<PluginPass & { opts?: Opts }> {
  const createClass = function (className: string) {
    return t.logicalExpression(
      '||',
      t.memberExpression(t.identifier('styles'), t.stringLiteral(className), true),
      t.stringLiteral(className),
    )
  }

  const exportBody = [
    t.objectPattern([
      t.objectProperty(
        t.identifier('styles'),
        t.assignmentPattern(t.identifier('styles'), t.objectExpression([])),
        false,
        true,
      ),
      t.restElement(t.identifier('props')),
    ]),
  ]

  // returns
  // export default (props) => ${input_svg_node}
  const getExport = function (svg: t.Expression) {
    return t.exportDefaultDeclaration(t.arrowFunctionExpression(exportBody, svg))
  }

  // returns
  // export default function ${name}(props){ return ${input_svg_node} }
  const getNamedExport = function (svg: t.Expression, name: string) {
    return t.exportDefaultDeclaration(
      t.functionDeclaration(
        t.identifier(name),
        exportBody,
        t.blockStatement([t.returnStatement(svg)]),
      ),
    )
  }

  return {
    visitor: {
      JSXAttribute(path: NodePath<t.JSXAttribute>) {
        const name = path.get('name')
        const value = path.get('value')

        if (name.isJSXNamespacedName()) {
          // converts
          // <svg xmlns:xlink="asdf">
          // to
          // <svg xmlnsXlink="asdf">
          name.replaceWith(
            t.jSXIdentifier(
              namespaceToCamel(
                (name as NodePath<t.JSXNamespacedName>).node.namespace.name,
                (name as NodePath<t.JSXNamespacedName>).node.name.name,
              ),
            ),
          )
        } else if (name.isJSXIdentifier()) {
          if (name.node.name === 'class') {
            // converts
            // <tag class="blah blah1"/>
            // to
            // <tag className="blah blah1"/>
            name.replaceWith(t.jSXIdentifier('className'))

            // converts
            // className="foo bar"
            // to
            // className={(styles["foo"] || "foo") + " " + (styles["bar"] || "bar")}
            const classes = (value as NodePath<t.StringLiteral>).node.value.split(/\s/)
            if (classes.length > 0) {
              let expr: t.LogicalExpression | t.BinaryExpression = createClass(classes[0])
              for (let i = 1; i < classes.length; i++) {
                expr = t.binaryExpression(
                  '+',
                  // (props.styles["foo"] || "foo") + " "
                  t.binaryExpression('+', expr, t.stringLiteral(' ')),
                  // (props.styles["bar"] || "bar")
                  createClass(classes[i]),
                )
              }
              value.replaceWith(t.jSXExpressionContainer(expr))
            }
          }

          // converts
          // <tag style="text-align: center; width: 50px">
          // to
          // <tag style={{textAlign: 'center', width: '50px'}}>
          if (name.node.name === 'style') {
            const csso = cssToObj((value as NodePath<t.StringLiteral>).node.value)
            const properties = Object.keys(csso).map(prop =>
              t.objectProperty(t.identifier(hyphenToCamel(prop)), t.stringLiteral(csso[prop])),
            )
            value.replaceWith(t.jSXExpressionContainer(t.objectExpression(properties)))
          }

          // converts
          // <svg stroke-width="5" data-x="0" aria-label="foo">
          // to
          // <svg strokeWidth="5" data-x="0" aria-label="foo">
          if (!/^(data-|aria-)/.test(name.node.name)) {
            name.replaceWith(t.jSXIdentifier(hyphenToCamel(name.node.name)))
          }
        }
      },

      // converts
      // <svg>
      // to
      // <svg {this.props}>
      // after passing through attributes visitors
      JSXOpeningElement(path: NodePath<t.JSXOpeningElement>) {
        if (t.isJSXIdentifier(path.node.name) && path.node.name.name.toLowerCase() === 'svg') {
          // add spread props
          path.node.attributes.push(t.jSXSpreadAttribute(t.identifier('props')))
        }
      },

      // converts
      // <svg/>
      // to
      // import React from 'react';
      // export default props => <svg {...props}/>;
      // after passing through other visitors
      ExpressionStatement(path: NodePath<t.ExpressionStatement>, state) {
        const expression = path.node.expression
        if (!t.isJSXElement(expression)) {
          return
        }

        const name = expression.openingElement.name
        if (!t.isJSXIdentifier(name) || name.name !== 'svg') {
          return
        }

        path.replaceWith(
          state.opts.componentName
            ? getNamedExport(path.get('expression').node, state.opts.componentName)
            : getExport(path.get('expression').node),
        )
      },

      Program(path: NodePath<t.Program>) {
        // add import react statement
        path.node.body.unshift(
          t.importDeclaration(
            [t.importDefaultSpecifier(t.identifier('React'))],
            t.stringLiteral('react'),
          ),
        )
      },
    },
  }
}
