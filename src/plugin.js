import cssToObj from './css-to-obj';
import hyphenToCamel from './hyphen-to-camel';

export default function (babel) {
  const t = babel.types;

  const hyphenToCamelVisitor = {
    JSXAttribute(path) {
      path.node.name.name = hyphenToCamel(path.node.name.name);
    }
  };

  const styleAttrVisitor = {
    JSXAttribute(path) {
      if (path.node.name.name === 'style') {
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
        t.identifier(path.node.name.name)
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

  const svgVisitor = {
    JSXOpeningElement(path) {
      if (t.isJSXIdentifier(path.node.name) && path.node.name.name.toLowerCase() === 'svg') {
        path.traverse(attrVisitor);
        path.traverse(styleAttrVisitor);
        path.traverse(hyphenToCamelVisitor);

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
        path.traverse(styleAttrVisitor);
        path.traverse(hyphenToCamelVisitor);
      }
    }
  };

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
                [
                  t.returnStatement(
                    svg
                  )
                ]
              )
            )
          ]
        ),
        []
      )
    );
  }

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
