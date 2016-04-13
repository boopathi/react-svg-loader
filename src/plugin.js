import cssToObj from './css-to-obj';
import {hyphenToCamel, namespaceToCamel} from './camelize';

export default function (babel) {
  const t = babel.types;

  // converts
  // <svg stroke-width="5" xmlns:xlink="asdf">
  // to
  // <svg strokeWidth="5" xmlnsXlink="asdf">
  const camelizeVisitor = {
    JSXAttribute(path) {
      if (t.isJSXNamespacedName(path.node.name)) {
        path.node.name = t.jSXIdentifier(
          namespaceToCamel(path.node.name.namespace.name, path.node.name.name.name)
        );
      } else if (t.isJSXIdentifier(path.node.name)) {
        path.node.name.name = hyphenToCamel(path.node.name.name);
      }
    }
  };

  // converts
  // <tag class="blah blah1"/>
  // to
  // <tag className="blah blah1"/>
  const classNameVisitor = {
    JSXAttribute(path) {
      if (t.isJSXIdentifier(path.node.name) && path.node.name.name === 'class') {
        path.node.name.name = "className";
      }
    }
  };

  // converts
  // <tag style="text-align: center; width: 50px">
  // to
  // <tag style={{textAlign: 'center', width: '50px'}}>
  const styleAttrVisitor = {
    JSXAttribute(path) {
      if (t.isJSXIdentifier(path.node.name) && path.node.name.name === 'style') {
        let csso = cssToObj(path.node.value.value);
        let properties = Object.keys(csso).map(prop => t.objectProperty(
          t.identifier(hyphenToCamel(prop)),
          t.stringLiteral(csso[prop])
        ));
        path.node.value = t.jSXExpressionContainer(
          t.objectExpression(properties)
        );
        return;
      }
    }
  };

  // Flow props from Output component to root SVG
  // converts
  // <svg width="50">
  // to
  // <svg width={this.props.width ? this.props.width : "50"}>
  const attrVisitor = {
    JSXAttribute(path) {
      if (!t.isJSXIdentifier(path.node.name)) return;
      // don't handle style attr. It needs to be an object
      if (path.node.name.name === 'style') return;

      // else
      const valueExpression = t.memberExpression(
        t.memberExpression(
          t.thisExpression(),
          t.identifier('props')
        ),
        t.identifier(hyphenToCamel(path.node.name.name))
      );

      path.node.value = t.jSXExpressionContainer(
        t.conditionalExpression(
          valueExpression,
          valueExpression,
          t.stringLiteral(path.node.value.value)
        )
      );

    }
  };

  // converts
  // <svg>
  // to
  // <svg {...this.props}>
  // after passing through attributes visitors
  const svgVisitor = {
    JSXOpeningElement(path) {
      if (t.isJSXIdentifier(path.node.name) && path.node.name.name.toLowerCase() === 'svg') {
        path.traverse(classNameVisitor);
        path.traverse(camelizeVisitor);
        path.traverse(attrVisitor);
        path.traverse(styleAttrVisitor);

        // add spread props
        path.node.attributes.push(
          t.jSXSpreadAttribute(
            t.memberExpression(
              t.thisExpression(),
              t.identifier('props')
            )
          )
        );
      } else {
        // don't ignore style attr transformations for other nodes
        path.traverse(classNameVisitor);
        path.traverse(camelizeVisitor);
        path.traverse(styleAttrVisitor);
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
  }

  // converts
  // <svg/>
  // to
  // import React from 'react';
  // export default class SVG extends React.Component { render() { <svg/> }}
  // after passing through other visitors
  const programVisitor = {
    Program(path) {
      if (path.node.body.length === 0) throw new Error('No Content in SVG file');
      if (path.node.body.length > 1) throw new Error('There is more than one root Element. We don\'t support this yet.');

      let node = path.node.body[0];
      if (!t.isExpressionStatement(node)) return;
      if (!t.isJSXElement(node.expression)) return;
      if (!t.isJSXIdentifier(node.expression.openingElement.name)) return;
      if (node.expression.openingElement.name.name !== 'svg') return;

      path.traverse(svgVisitor);

      // replace the entire node to
      // export default class extends React {
      //   render () {
      //     SVG_NODE
      //   }
      // }

      path.node.body[0] = getExport(node.expression);

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
    visitor: programVisitor
  };
}
