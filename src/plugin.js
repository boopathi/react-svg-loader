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

        if (path.node.name.name.indexOf('data-') !== 0) {
          // converts
          // <svg stroke-width="5">
          // to
          // <svg strokeWidth="5">
          path.node.name.name = hyphenToCamel(path.node.name.name);
        }
      }
    }
  };

  // returns
  // export default class SVG extends React.Component {
  // ++ const { style, ...rest } = props; // <-- extracts style from consumer's props
  // ++ const finalStyle = {...style, ${svg_styling_options} };
  //   render() {
  //     return ${input_svg_node}
  //   }
  // }
  const getExport = function (svg, styleProp, className = 'SVG') {
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
                [
                  t.variableDeclaration('const', [      // const
                    t.variableDeclarator(
                      t.identifier('{style, ...rest}'), // { style, ...rest }
                      // =
                      // t.thisExpression(),
                      t.identifier('this.props')             // this.props;
                    )
                  ]),
                  t.variableDeclaration('const', [      // const
                    t.variableDeclarator(
                      t.identifier('finalStyle'),                         // finalStyle
                      // =
                      t.identifier('{ ...style, ' + styleProp + ' }') // { ...style, <STYLE_OPTIONS> };
                    ),
                  ]),
                  t.returnStatement(svg)
                ]
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
  // <svg {...rest}>
  // after passing through attributes visitors
  const svgVisitor = {
    JSXOpeningElement(path) {
      if (path.node.name.name.toLowerCase() === 'svg') {
        // add spread props
        path.node.attributes.push(
          t.identifier('style={finalStyle}') // style={finalStyle}
        );
        path.node.attributes.push(
          t.jSXSpreadAttribute(
            t.identifier('rest') // ...rest
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
    ExpressionStatement(path, state) {
      if (!path.get('expression').isJSXElement()) return;
      if (path.get('expression.openingElement.name').node.name !== 'svg') return;
      path.replaceWith(getExport(path.get('expression').node, state.opts.styleProp));
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
