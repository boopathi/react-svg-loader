import { validateAndFix } from "../src/svgo";
import test from "tape";

test("fills essential plugins when empty", function(t) {
  let opts = {};
  opts = validateAndFix(opts);
  t.equal(opts.plugins.length, 3);
  t.end();
});

test("enable disabled essential plugins", function(t) {
  let opts = {
    full: true,
    plugins: ["removeDoctype", { removeComments: false }]
  };
  opts = validateAndFix(opts);
  t.equal(opts.plugins.length, 3);
  t.equal(opts.plugins[1].removeComments, true);
  t.end();
});
