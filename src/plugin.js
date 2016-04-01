export default function (babel) {
  const t = babel.types;

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
  }

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
  }

  return {
    visitor: svgVisitor
  };
}
