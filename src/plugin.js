export default function (babel) {
  const t = babel.types;

  const attrVisitor = {
    JSXAttribute(path) {
      if (!t.isJSXIdentifier(path.node.name)) return;

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
