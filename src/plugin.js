// @flow

import cssToObj from "./css-to-obj";
import { hyphenToCamel, namespaceToCamel } from "./camelize";
import type BabelCore from "babel-core";

export default function(babel: BabelCore) {
  const t = babel.types;

  const createClass = (className: string) =>
    t.logicalExpression(
      "||",
      t.memberExpression(
        /* object   = */ t.identifier("styles"),
        /* property = */ t.stringLiteral(className),
        /* computed = */ true
      ),
      t.stringLiteral(className)
    );

  const attrVisitor = {
    JSXAttribute(path: any) {
      const name = path.get("name");
      const value = path.get("value");

      if (name.isJSXNamespacedName()) {
        // converts
        // <svg xmlns:xlink="asdf">
        // to
        // <svg xmlnsXlink="asdf">
        name.replaceWith(
          t.jSXIdentifier(
            namespaceToCamel(
              path.node.name.namespace.name,
              path.node.name.name.name
            )
          )
        );
      } else if (name.isJSXIdentifier()) {
        if (name.node.name === "class") {
          // converts
          // <tag class="blah blah1"/>
          // to
          // <tag className="blah blah1"/>
          name.replaceWith(t.jSXIdentifier("className"));

          // converts
          // className="foo bar"
          // to
          // className={(styles["foo"] || "foo") + " " + (styles["bar"] || "bar")}
          let classes = value.node.value.split(/\s/);

          if (classes.length > 0) {
            let expr = createClass(classes[0]);
            for (let i = 1; i < classes.length; i++) {
              expr = t.binaryExpression(
                "+",
                // (props.styles["foo"] || "foo") + " "
                t.binaryExpression("+", expr, t.stringLiteral(" ")),
                // (props.styles["bar"] || "bar")
                createClass(classes[i])
              );
            }
            value.replaceWith(t.jSXExpressionContainer(expr));
          }
        }

        // converts
        // <tag style="text-align: center; width: 50px">
        // to
        // <tag style={{textAlign: 'center', width: '50px'}}>
        if (name.node.name === "style") {
          let csso = cssToObj(value.node.value);
          let properties = Object.keys(csso).map(prop =>
            t.objectProperty(
              t.identifier(hyphenToCamel(prop)),
              t.stringLiteral(csso[prop])
            )
          );
          value.replaceWith(
            t.jSXExpressionContainer(t.objectExpression(properties))
          );
        }

        // converts
        // <svg stroke-width="5" data-x="0">
        // to
        // <svg strokeWidth="5" data-x="0">
        if (name.node.name.indexOf("data-") !== 0) {
          name.replaceWith(t.jSXIdentifier(hyphenToCamel(path.node.name.name)));
        }
      }
    }
  };

  // returns
  // export default (props) => ${input_svg_node}
  const getExport = function(svg) {
    return t.exportDefaultDeclaration(
      t.arrowFunctionExpression(
        [
          t.objectPattern([
            t.objectProperty(
              t.identifier("styles"),
              t.assignmentPattern(
                t.identifier("styles"),
                t.objectExpression([])
              ),
              false,
              true
            ),
            t.restProperty(t.identifier("props"))
          ])
        ],
        svg
      )
    );
  };

  // converts
  // <svg>
  // to
  // <svg {this.props}>
  // after passing through attributes visitors
  const svgVisitor = {
    JSXOpeningElement(path: any) {
      if (path.node.name.name.toLowerCase() === "svg") {
        // add spread props
        path.node.attributes.push(t.jSXSpreadAttribute(t.identifier("props")));
      }
    }
  };

  // converts
  // <svg/>
  // to
  // import React from 'react';
  // export default props => <svg {...props}/>;
  // after passing through other visitors
  const svgExpressionVisitor = {
    ExpressionStatement(path: any) {
      if (!path.get("expression").isJSXElement()) return;
      if (path.get("expression.openingElement.name").node.name !== "svg")
        return;
      path.replaceWith(getExport(path.get("expression").node));
    }
  };

  const programVisitor = {
    Program(path: any) {
      // add import react statement
      path.node.body.unshift(
        t.importDeclaration(
          [t.importDefaultSpecifier(t.identifier("React"))],
          t.stringLiteral("react")
        )
      );
    }
  };

  return {
    visitor: Object.assign(
      {},
      programVisitor,
      svgExpressionVisitor,
      svgVisitor,
      attrVisitor
    )
  };
}
