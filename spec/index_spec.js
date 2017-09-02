'use strict';

describe("shared examples", () => {
  const SharedExamples = require('..');
  var obj = {fn: function() {}};
  var sharedExamplesCode = () => { it("example", exampleCode); };
  var exampleCode = () => { obj.fn(); };

  beforeEach(() => {
    delete jasmine.sharedExamples;

    spyOn(obj, 'fn');
    spyOn(jasmine.getGlobal(), 'describe').and.callThrough();
    spyOn(jasmine.getGlobal(), 'it').and.callThrough();
  });

  describe("when defining", () => {
    var define = () => { SharedExamples.sharedExamplesFor("foo", sharedExamplesCode); };

    it("does not perform context definition", () => {
      define();
      expect(describe).not.toHaveBeenCalled();
    });

    it("does not perform example definition", () => {
      define();
      expect(it).not.toHaveBeenCalled();
    });

    it("does not perform example code", () => {
      define();
      expect(obj.fn).not.toHaveBeenCalled();
    });

    describe("twice", () => {
      it("fails", () => {
        define();
        expect(define).toThrow("Example group “foo” already defined.");
      });
    });

    describe("without a function", () => {
      it("fails", () => {
        expect(() => { SharedExamples.sharedExamplesFor("foo", "bar"); })
            .toThrow("Examples have to be a function.");
      });
    });
  });

  describe("when applying", () => {
    var applyOptions;
    var apply = () => { SharedExamples.itBehavesLike('foo', ...applyOptions); };
    var providedContext;

    beforeEach(() => {
      applyOptions = [];
      providedContext = undefined;
      SharedExamples.sharedExamplesFor("foo", (...context) => {
        providedContext = context;
        sharedExamplesCode();
      });
    });

    it("performs context definition wrapping example definition", () => {
      describe.and.returnValue(null);
      apply();
      expect(describe).toHaveBeenCalled();
      expect(describe.calls.argsFor(0)[0]).toBe("foo");
      expect(it).not.toHaveBeenCalled();
    });

    it("performs example definition", () => {
      apply();
      expect(it).toHaveBeenCalledWith("example", exampleCode);
    });

    it("does not perform example code", () => {
      apply();
      expect(obj.fn).not.toHaveBeenCalled();
    });

    describe("with context", () => {
      beforeEach(() => { applyOptions = [{context: "info"}, "more", "data"]; });

      it("forwards the context to the context definition code", () => {
        apply();
        expect(providedContext).toEqual([{context: "info"}, "more", "data"]);
      });

      describe("with a function as last context element", () => {
        var contextFunctionCalled;

        beforeEach(() => {
          contextFunctionCalled = false;
          applyOptions = ["more", "data", () => {
            contextFunctionCalled = true;
            providedContext = "fake value";
          }];
        });

        it("performs the function prior to the context definition code", () => {
          apply();
          expect(contextFunctionCalled).toBeTruthy();
          expect(providedContext).not.toEqual("fake value");
        });

        it("performs the function inside the context definition", () => {
          describe.and.returnValue(null);
          apply();
          expect(contextFunctionCalled).toBeFalsy();
        });

        it("forwards the remaining context to the context definition code", () => {
          apply();
          expect(providedContext).toEqual(["more", "data"]);
        });
      });
    });

    describe("undefined examples", () => {
      it("fails", () => {
        expect(() => { SharedExamples.itBehavesLike("fu"); })
            .toThrow("Example group “fu” not defined.");
      });
    });
  });
});
