import reactSVGLoader from "../src/loader";
import React from "react";
import ShallowRenderer from "react-test-renderer/shallow";
import test from "tape";
import vm from "vm";
import { transform } from "@babel/core";

function loader(content, query) {
  return new Promise(function(resolve, reject) {
    let context = {
      query,
      cacheable() {},
      addDependency() {},
      async() {
        return function(err, result) {
          if (err) return reject(err);

          let exports = {};
          let sandbox = { module: { exports }, exports, require };
          vm.runInNewContext(
            transform(result, {
              babelrc: false,
              configFile: false,
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: { ie: 11 }
                  }
                ],
                "@babel/preset-react"
              ]
            }).code,
            sandbox
          );
          resolve(sandbox.exports.default);
        };
      }
    };
    reactSVGLoader.apply(context, [content]);
  });
}

function render(element) {
  let r = new ShallowRenderer();
  r.render(element);
  return r.getRenderOutput();
}

test("empty svg tag", function(t) {
  t.plan(1);

  loader(`<svg/>`)
    .then(component => render(React.createElement(component)))
    .then(r => {
      t.equal(r.type, "svg");
    })
    .catch(t.end);
});

test("svg tag with some props", function(t) {
  t.plan(4);

  loader(`<svg width="50" height="50" />`)
    .then(component => render(React.createElement(component)))
    .then(r => {
      t.equal(r.type, "svg", "tag check");
      t.assert(Object.keys(r.props).length > 1, "assert props exists");
      t.equal(r.props.width, "50", "width prop check");
      t.equal(r.props.height, "50", "height prop check");
    })
    .catch(t.end);
});

test("passing props to empty svg tag", function(t) {
  t.plan(4);

  loader(`<svg/>`)
    // pass in number - comes out as number,
    // pass in string - comes out as string
    .then(component =>
      render(React.createElement(component, { width: 100, height: "100" }))
    )
    .then(r => {
      t.equal(r.type, "svg", "tag check");
      t.assert(Object.keys(r.props).length > 1, "assert props exists");
      t.equal(r.props.width, 100, "width prop check");
      t.equal(r.props.height, "100", "height prop check");
    })
    .catch(t.end);
});

test("overriding props of an svg", function(t) {
  t.plan(4);

  loader(`<svg width="50" height="50" />`)
    .then(component =>
      render(React.createElement(component, { width: 100, height: "100" }))
    )
    .then(r => {
      t.equal(r.type, "svg", "tag check");
      t.assert(Object.keys(r.props).length > 1, "assert props exists");
      t.equal(r.props.width, 100, "width prop check");
      t.equal(r.props.height, "100", "height prop check");
    })
    .catch(t.end);
});

test("compression: namespace attr", function(t) {
  t.plan(1);

  loader(`<svg xmlns:bullshit="adsf" />`)
    .then(component => render(React.createElement(component)))
    .then(r => {
      t.equal(Object.keys(r.props).length, 0, "namespace props are stripped");
    })
    .catch(t.end);
});

test("should not convert data-* and aria-* props", function(t) {
  t.plan(2);

  loader(`<svg data-foo="foo" aria-label="Open"></svg>`, {
    svgo: {
      plugins: [{ removeUnknownsAndDefaults: false }]
    }
  })
    .then(component => render(React.createElement(component)))
    .then(r => {
      t.notEqual(
        Object.keys(r.props).indexOf("data-foo"),
        -1,
        "data-* shouldn't be camelCased"
      );
      t.notEqual(
        Object.keys(r.props).indexOf("aria-label"),
        -1,
        "aria-* shouldn't be camelCased"
      );
    })
    .catch(t.end);
});

const circle = `
<svg class='class1 class2' style='text-align: center; width: 100px;height:100px' fill="#ddd" pointer-events="stroke">
  <circle class='class3 class4' cx="50" cy="50" r="25" style="text-align: center; stroke: #000000;" stroke-width="5" />
</svg>
`;

test("converts attr from hyphen to camel", function(t) {
  loader(circle)
    .then(c => {
      let r = render(React.createElement(c));
      t.ok(r.props.pointerEvents, "contains pointerEvents");
      t.notOk(r.props["pointer-events"], "does not contain pointer-events");
      t.end();
    })
    .catch(t.end);
});

test("style attr of root svg", function(t) {
  loader(circle)
    .then(c => {
      let r = render(React.createElement(c));
      t.ok(r.props.style, "contains style attr");
      t.equal(typeof r.props.style, "object", "style attr is an object");
      t.ok(r.props.style.width, "contains width");
      t.ok(r.props.style.textAlign, "contains textAlign");
      t.notOk(r.props.style["text-align"], "does not contain text-align");
      t.end();
    })
    .catch(t.end);
});

test("converts class to className", function(t) {
  loader(circle)
    .then(c => {
      let r = render(React.createElement(c));
      t.ok(r.props.className, "contains className");
      t.notOk(r.props.class, "does not contain class");
      t.end();
    })
    .catch(t.end);
});

test("converts attr of children from hyphen to camel", function(t) {
  loader(circle)
    .then(c => {
      let r = render(React.createElement(c));
      let props = r.props.children.props;
      t.ok(props.strokeWidth, "contains strokeWidth");
      t.notOk(props["stroke-width"], "does not contain stroke-width");
      t.end();
    })
    .catch(t.end);
});

test("style attr of children", function(t) {
  loader(circle)
    .then(c => {
      let r = render(React.createElement(c));
      let props = r.props.children.props;
      t.ok(props.style, "contais style attr");
      t.equal(typeof props.style, "object", "style attr is an object");
      t.ok(props.style.textAlign, "contains textAlign");
      t.notOk(props.style["text-align"], "does not contain text-align");
      t.end();
    })
    .catch(t.end);
});
