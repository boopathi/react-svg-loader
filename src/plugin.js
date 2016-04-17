import cssToObj from './css-to-obj';
import {hyphenToCamel, namespaceToCamel} from './camelize';

export default function (babel) {
  const t = babel.types;

  const attrVisitor = {
    JSXAttribute(path) {
      if (t.isJSXNamespacedName(path.node.name)) {
        // converts
        // <svg xmlns:xlink="asdf">
        // to
        // <svg xmlnsXlink="asdf">
        path.node.name = t.jSXIdentifier(
          namespaceToCamel(path.node.name.namespace.name, path.node.name.name.name)
        );
      } else if (t.isJSXIdentifier(path.node.name)) {
        // converts
        // <tag class="blah blah1"/>
        // to
        // <tag className="blah blah1"/>
        if (path.node.name.name === 'class') {
          path.node.name.name = "className";
        }

        // converts
        // <tag style="text-align: center; width: 50px">
        // to
        // <tag style={{textAlign: 'center', width: '50px'}}>
        if (path.node.name.name === 'style') {
          let csso = cssToObj(path.node.value.value);
          let properties = Object.keys(csso).map(prop => t.objectProperty(
            t.identifier(hyphenToCamel(prop)),
            t.stringLiteral(csso[prop])
          ));
          path.node.value = t.jSXExpressionContainer(
            t.objectExpression(properties)
          );
        }

        // converts
        // <svg stroke-width="5">
        // to
        // <svg strokeWidth="5">
        path.node.name.name = hyphenToCamel(path.node.name.name);
      }
    }
  };

  // returns
  // export default class SVG extends React.Component {
  //   render() {
  //     return ${input_svg_node}
  //   }
  // }
  const getExport = function (svg, className = 'SVG') {
    return t.exportDefaultDeclaration(
      t.classDeclaration(
        t.identifier(className),
        t.memberExpression(
          t.identifier('React'),
          t.identifier('Component')
        ),
        t.classBody(
          [
            t.classMethod(
              'method',
              t.identifier('render'),
              [],
              t.blockStatement(
                [t.returnStatement(svg)]
              )
            )
          ]
        ),
        []
      )
    );
  };

  // converts
  // <svg>
  // to
  // <svg {...this.props}>
  // after passing through attributes visitors
  const svgVisitor = {
    JSXOpeningElement(path) {
      if (path.node.name.name.toLowerCase() === 'svg') {
        // add spread props
        path.node.attributes.push(
          t.jSXSpreadAttribute(
            t.memberExpression(
              t.thisExpression(),
              t.identifier('props')
            )
          )
        );
      }
    }
  };

  // converts
  // <svg/>
  // to
  // import React from 'react';
  // export default class SVG extends React.Component { render() { <svg/> }}
  // after passing through other visitors
  const svgExpressionVisitor = {
    ExpressionStatement(path) {
      if (!path.get('expression').isJSXElement()) return;
      if (path.get('expression.openingElement.name').node.name !== 'svg') return;
      path.replaceWith(getExport(path.get('expression').node));
    }
  }

  const programVisitor = {
    Program(path) {
      // add import react statement
      path.node.body.unshift(
        t.importDeclaration(
          [
            t.importDefaultSpecifier(t.identifier('React'))
          ],
          t.stringLiteral('react')
        )
      );
    }
  }

  return {
    visitor: Object.assign({}, programVisitor, svgExpressionVisitor, svgVisitor, attrVisitor)
  };
}
