import test from "node:test";
import assert from "node:assert/strict";
import { parseAnswer, isCorrect } from "../src/lib/answer.js";

test("cevap ayrıştırma: virgül, kesir, eksi", () => {
  assert.equal(parseAnswer("3/4"), 0.75);
  assert.equal(parseAnswer("-1,5"), -1.5);
  assert.equal(parseAnswer("−2"), -2);
  assert.equal(parseAnswer(" 12 "), 12);
  assert.ok(Number.isNaN(parseAnswer("abc")));
  assert.ok(Number.isNaN(parseAnswer("1/0")));
  assert.ok(Number.isNaN(parseAnswer("")));
});

test("cevap kontrolü: yuvarlanmış ondalık kabul, kaba yaklaşık red", () => {
  assert.ok(isCorrect("0,33", { a: 1 / 3 }));
  assert.ok(!isCorrect("0,3", { a: 1 / 3 }));
  assert.ok(isCorrect("1/3", { a: 1 / 3 }));
  assert.ok(isCorrect("12", { a: 12 }));
  assert.ok(!isCorrect("13", { a: 12 }));
  assert.ok(isCorrect("3,1", { a: 3, tol: 0.2 }));
});
