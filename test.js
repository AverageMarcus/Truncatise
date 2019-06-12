var truncatise		= require("./"),
    chai			= require("chai"),
    assert			= require("chai").assert,
    mocha           = require("mocha");
    chai.should();

describe("Truncating to characters", function(){
	it("should be able to strip html", function(){
		truncatise("<p>This is a test of <b>html</b> <strong>tag</strong> <span class='cssClass'>stripping</span></p>", {TruncateLength: 10, TruncateBy : "characters", Strict : true, StripHTML : true, Suffix : ''})
			.should.equal("This is a");
	});

	it("should be able handle and ignore self-closing tags", function(){
		truncatise("<p>This<img src=\"test.jpg\" /> is a test of self-closing tags such as <img src=\"test.jpg\" /></p>", {TruncateLength: 10, TruncateBy : "characters", Strict : true, StripHTML : true, Suffix : ''})
			.should.equal("This is a");
	});

	it("should ignore comments",function() {
        truncatise("<p>This <!-- is a test --> <strong>is a test of comments</strong></p>",{TruncateLength: 10, TruncateBy : "characters", Strict : true, StripHTML : true, Suffix : ''})
            .should.equal("This  is a");
    });

	it("should strip comments",function() {
        truncatise("<p>This <!-- comment <a href='/'>link</a> test --><strong>is a test of comments</strong></p>",{TruncateLength: 7, TruncateBy : "characters", Strict : true, StripHTML : true, Suffix : ''})
            .should.equal("This is");
    });

	it("should ignore tags in comments",function() {
        truncatise("<p>This <!-- is <a href='/'>a</a> test --><strong>is a test of comments</strong></p>",{TruncateLength: 9, TruncateBy : "character", Strict : true, StripHTML : true, Suffix : ''})
            .should.equal("This is a");
    });

	it("should correctly handle comments when not stripping tags",function() {
        truncatise("<p>This <!-- comment --><strong>is a test of comments</strong></p>",{TruncateLength: 9, TruncateBy : "character", Strict : true, StripHTML : false, Suffix : ''})
            .should.equal("<p>This <!-- comment --><strong>is a</strong></p>");
    });

	it("should return all if truncate length is longer than input",function() {
        truncatise("<p>This is a test of length</p>",{TruncateLength: 100, TruncateBy : "characters", Strict : true, StripHTML : true, Suffix : ''})
            .should.equal("This is a test of length");
    });

	it("should handle encoded entities",function() {
        truncatise("<p>This is &amp; test of length</p>",{TruncateLength: 100, TruncateBy : "characters", Strict : true, StripHTML : true, Suffix : ''})
            .should.equal("This is &amp; test of length");
    });

	it("should strip custom tags",function() {
        truncatise("<p>This is <faketag>a</faketag> test of length</p>",{TruncateLength: 100, TruncateBy : "characters", Strict : true, StripHTML : true, Suffix : ''})
            .should.equal("This is a test of length");
    });

	it("should not split a word when not strict",function() {
        truncatise("<p>This is a test of strictness</p>",{TruncateLength: 12, TruncateBy : "characters", Strict : false, StripHTML : true, Suffix : ''})
            .should.equal("This is a test");
    });

	it("should split a word when strict is true",function() {
        truncatise("<p>This is a test of strictness</p>",{TruncateLength: 12, TruncateBy : "characters", Strict : true, StripHTML : true, Suffix : ''})
            .should.equal("This is a te");
    });
});

describe("Truncating to words", function(){
	it("should be able to strip html", function(){
		truncatise("<p>This is a test of <b>html</b> <strong>tag</strong> <span class='cssClass'>stripping</span></p>", {TruncateLength: 3, TruncateBy : "words", StripHTML : true, Suffix : ''})
			.should.equal("This is a");
	});

	it("should be able to handle html tags", function(){
		truncatise("<p>This is a test of <b>html</b> <strong>tag</strong> <span class='cssClass'>stripping</span></p>", {TruncateLength: 3, TruncateBy : "words", StripHTML : false, Suffix : ''})
			.should.equal("<p>This is a</p>");
	});
});

describe("Truncating to paragraphs", function(){
	it("should be able to strip html", function(){
		truncatise("<p>This is a test of <b>html</b> <strong>tag</strong> <span class='cssClass'>stripping</span></p><p>With multiple paragraphs</p>", {TruncateLength: 1, TruncateBy : "paragraph", StripHTML : true, Suffix : ''})
			.should.equal("This is a test of html tag stripping");
	});

	it("should be able to handle html tags", function(){
		truncatise("<p>This is a test of <b>html</b> <strong>tag</strong> <span class='cssClass'>stripping</span></p><p>With multiple paragraphs</p>", {TruncateLength: 1, TruncateBy : "paragraph", StripHTML : false, Suffix : ''})
			.should.equal("<p>This is a test of <b>html</b> <strong>tag</strong> <span class='cssClass'>stripping</span></p>");
	});

	it("should be able to handle several paragraphs", function(){
		truncatise("<p>This</p><p>is</p><p>a</p><p>test</p><p>of</p><p>multiple</p><p>paragraphs</p>", {TruncateLength: 3, TruncateBy : "paragraph", StripHTML : true, Suffix : ''})
			.should.equal("This is a");
	});

	it("should append the suffix inside the paragraph", function(){
		truncatise("<p>This</p><p>is</p><p>a</p><p>test</p><p>of</p><p>multiple</p><p>paragraphs</p>", {TruncateLength: 3, TruncateBy : "paragraph", StripHTML : false, Suffix : '...'})
			.should.equal("<p>This</p><p>is</p><p>a...</p>");
	});

	it("should be able to handle double newline", function(){
		truncatise("This\n\nIs\r\n\r\nA\n\nTest", {TruncateLength: 3, TruncateBy : "paragraph", StripHTML : true, Suffix : ''})
			.should.equal("This Is A");
	});

	it("should be able to handle double newline", function(){
		truncatise("<p>This</p>\n\n<p>Is</p>\n\n<p>A</p>\n\n<p>Test</p>", {TruncateLength: 3, TruncateBy : "paragraph", StripHTML : true, Suffix : ''})
			.should.equal("This Is A");
	});
});

describe("Appending a suffix", function(){
	it("should append ... by default",function(){
		truncatise("This is a long paragraph that I intend to truncate.",{TruncateLength: 14, TruncateBy : "characters", Strict : true, StripHTML : true})
            .should.equal("This is a long...");
	});

	it("should append the provided suffix",function(){
		truncatise("This is a long paragraph that I intend to truncate.",{TruncateLength: 14, TruncateBy : "characters", Strict : true, StripHTML : true, Suffix : ' (Read More)'})
            .should.equal("This is a long (Read More)");
	});

	it("should place the suffix correctly within open tags",function(){
		truncatise("<p>This is a long paragraph that I intend to truncate.</p>",{TruncateLength: 2, TruncateBy : "words", StripHTML : false})
            .should.equal("<p>This is...</p>");
	});

  it("shouldn't add suffix if text length is less than truncate lengh (paragraph)",function() {
    truncatise("<p>This is a long paragraph that I intend to truncate.</p>",{TruncateLength: 2, TruncateBy : "paragraphs", StripHTML : false})
            .should.equal("<p>This is a long paragraph that I intend to truncate.</p>");
  });

  it("shouldn't add suffix if text length is same as truncate lengh (paragraph)",function() {
    truncatise("<p>This is a long paragraph that I intend to truncate.</p>",{TruncateLength: 1, TruncateBy : "paragraphs", StripHTML : false})
            .should.equal("<p>This is a long paragraph that I intend to truncate.</p>");
  });

  it("shouldn't add suffix if text length is less than truncate lengh (word)",function() {
    truncatise("This is a short line.",{TruncateLength: 200, TruncateBy : "words", StripHTML : false})
            .should.equal("This is a short line.");
  });

  it("shouldn't add suffix if text length is same as truncate lengh (word)",function() {
    truncatise("This is a short line.",{TruncateLength: 5, TruncateBy : "words", StripHTML : false})
            .should.equal("This is a short line.");
  });

  it("shouldn't add suffix if text length is less than truncate lengh (chars)",function() {
    truncatise("This is a short line.",{TruncateLength: 200, TruncateBy : "characters", StripHTML : false})
            .should.equal("This is a short line.");
  });

  it("shouldn't add suffix if text length is same as truncate lengh (chars)",function() {
    truncatise("This is a short line.",{TruncateLength: 21, TruncateBy : "characters", StripHTML : false})
            .should.equal("This is a short line.");
  });

  it("shouldn't add suffix if text length is same as truncate lengh (paragraph with trailing space)",function() {
    truncatise("<p>This is a long paragraph that I intend to truncate.</p>   ",{TruncateLength: 1, TruncateBy : "paragraphs", StripHTML : false})
            .should.equal("<p>This is a long paragraph that I intend to truncate.</p>");
  });
});

describe("Handling tags", function(){
	it("should be able to close an open tag",function(){
		truncatise("<p>This is a long paragraph that I intend to truncate.</p>",{TruncateLength: 2, TruncateBy : "words", StripHTML : false, Suffix : ''})
            .should.equal("<p>This is</p>");
	});

	it("should be able to close multiple open tags",function(){
		truncatise("<p>This <a href=\"/\">is a long paragraph</a> that I intend to truncate.</p>",{TruncateLength: 2, TruncateBy : "words", StripHTML : false, Suffix : ''})
            .should.equal("<p>This <a href=\"/\">is</a></p>");
	});

    it("should not append self-closing br tags to the end of the string",function(){
		truncatise("<p>This<br>handles<br></p>",{TruncateLength: 2, TruncateBy : "words", StripHTML : false, Suffix : ''})
            .should.equal("<p>This<br>handles<br></p>");
	});
});

describe("Performance testing",function() {
    var input = "";
    for (var i=0; i<1000000; i++) {
            input += "<p>This is a paragraph used for performance testing</p>\n";
    }

    describe("truncate to only 400 words from a 1000000 paragraph long string",function() {
        it("should take less than a second",function() {
                var startTime = Date.now();
				truncatise(input,{TruncateLength: 400, TruncateBy : "words", StripHTML : true, Suffix : ''});
                (Date.now() - startTime).should.be.lte(1000);
        });
    });

    describe("truncate to only 1000 words from a 1000000 paragraph long string",function() {
        it("should take less than a second",function() {
                var startTime = Date.now();
				truncatise(input,{TruncateLength: 1000, TruncateBy : "words", StripHTML : true, Suffix : ''});
                (Date.now() - startTime).should.be.lte(1000);
        });
    });

    describe("truncate to only 10000 words from a 1000000 paragraph long string",function() {
        it("should take less than a second",function() {
                var startTime = Date.now();
				truncatise(input,{TruncateLength: 10000, TruncateBy : "words", StripHTML : true, Suffix : ''});
                (Date.now() - startTime).should.be.lte(1000);
        });
    });
});

describe("Strict", function(){
	it("should close in the middle of a word when strict enabled",function(){
		truncatise("This is a test of strict mode",{TruncateLength: 12, TruncateBy : "characters", StripHTML : false, Strict : true, Suffix : ''})
            .should.equal("This is a te");
	});

	it("should not close in the middle of a word when strict disabled",function(){
		truncatise("This is a test of strict mode",{TruncateLength: 12, TruncateBy : "characters", StripHTML : false, Strict : false, Suffix : ''})
            .should.equal("This is a test");
	});

	it("should not close at an apostrophe when strict disabled",function(){
		truncatise("This is a test I'm doing of strict mode",{TruncateLength: 16, TruncateBy : "characters", StripHTML : false, Strict : false, Suffix : ''})
            .should.equal("This is a test I'm");
	});

  it("should not close on accented char when strict disabled",function(){
		truncatise("test test tést test",{TruncateLength: 12, TruncateBy : "characters", StripHTML : false, Strict : false, Suffix : ''})
            .should.equal("test test tést");
	});

  it("should not close on capital letter when strict disabled",function(){
		truncatise("This is a TEST of strict mode",{TruncateLength: 12, TruncateBy : "characters", StripHTML : false, Strict : false, Suffix : ''})
            .should.equal("This is a TEST");
	});

});

describe("Handing newlines", function() {
    it("should replace newlines with spaces", function(){
		truncatise("<div><!--block-->Laborum. <strong>Odit</strong> in omn.<br>Lorem Ipsum Abc<br>Lorem Ipsum<br>Lorem Ipsum</div>", {TruncateLength: 8, TruncateBy : "words", StripHTML: true})
			.should.equal("Laborum. Odit in omn. Lorem Ipsum Abc Lorem...");
	});
})
