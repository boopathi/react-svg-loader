import { validateAndFix } from "../packages/react-svg-core/src/svgo";
import test from "tape";

test("fills essential plugins and default plugins when empty", function(t) {
  let opts: any = {};
  opts = validateAndFix(opts);
  t.equal(opts.plugins.length, 4);
  t.end();
});

test("enable disabled essential plugins", function(t) {
  let opts: any = {
    full: true,
    plugins: ["removeDoctype", { removeComments: false }]
  };
  opts = validateAndFix(opts);
  t.equal(opts.plugins.length, 4);
  t.equal(opts.plugins[1].removeComments, true);
  t.end();
});

test("default plugins are set by default", t => {
  let opts: any = {};
  opts = validateAndFix(opts);
  t.assert(
    opts.plugins.find(
      p =>
        Object.prototype.hasOwnProperty.call(p, "removeViewBox") &&
        p.removeViewBox === false
    )
  );
  t.end();
});
