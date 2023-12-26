(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";var e=require("@csstools/css-tokenizer"),n=require("@csstools/css-parser-algorithms");class LayerName{parts;constructor(e){this.parts=e}tokens(){return[...this.parts]}slice(n,r){const t=[];for(let n=0;n<this.parts.length;n++)this.parts[n][0]===e.TokenType.Ident&&t.push(n);const a=t.slice(n,r);return new LayerName(this.parts.slice(a[0],a[a.length-1]+1))}concat(n){const r=[e.TokenType.Delim,".",-1,-1,{value:"."}];return new LayerName([...this.parts.filter((n=>n[0]===e.TokenType.Ident||n[0]===e.TokenType.Delim)),r,...n.parts.filter((n=>n[0]===e.TokenType.Ident||n[0]===e.TokenType.Delim))])}segments(){return this.parts.filter((n=>n[0]===e.TokenType.Ident)).map((e=>e[4].value))}name(){return this.parts.filter((n=>n[0]===e.TokenType.Ident||n[0]===e.TokenType.Delim)).map((e=>e[1])).join("")}equal(e){const n=this.segments(),r=e.segments();if(n.length!==r.length)return!1;for(let e=0;e<n.length;e++){if(n[e]!==r[e])return!1}return!0}toString(){return e.stringify(...this.parts)}toJSON(){return{parts:this.parts,segments:this.segments(),name:this.name()}}}function parseFromTokens(r,t){const a=n.parseCommaSeparatedListOfComponentValues(r,{onParseError:t?.onParseError}),s=t?.onParseError??(()=>{}),o=["6.4.2. Layer Naming and Nesting","Layer name syntax","<layer-name> = <ident> [ '.' <ident> ]*"],i=r[0][2],l=r[r.length-1][3],p=[];for(let r=0;r<a.length;r++){const t=a[r];for(let r=0;r<t.length;r++){const a=t[r];if(!n.isTokenNode(a)&&!n.isCommentNode(a)&&!n.isWhitespaceNode(a))return s(new e.ParseError(`Invalid cascade layer name. Invalid layer name part "${a.toString()}"`,i,l,o)),[]}const m=t.flatMap((e=>e.tokens()));let c=!1,T=!1,y=null;for(let n=0;n<m.length;n++){const r=m[n];if(r[0]!==e.TokenType.Comment&&r[0]!==e.TokenType.Whitespace&&r[0]!==e.TokenType.Ident&&(r[0]!==e.TokenType.Delim||"."!==r[4].value))return s(new e.ParseError(`Invalid cascade layer name. Invalid character "${r[1]}"`,i,l,o)),[];if(!c&&r[0]===e.TokenType.Delim)return s(new e.ParseError("Invalid cascade layer name. Layer names can not start with a dot.",i,l,o)),[];if(c){if(r[0]===e.TokenType.Whitespace){T=!0;continue}if(T&&r[0]===e.TokenType.Comment)continue;if(T)return s(new e.ParseError("Invalid cascade layer name. Encountered unexpected whitespace between layer name parts.",i,l,o)),[];if(y&&y[0]===e.TokenType.Ident&&r[0]===e.TokenType.Ident)return s(new e.ParseError("Invalid cascade layer name. Layer name parts must be separated by dots.",i,l,o)),[];if(y&&y[0]===e.TokenType.Delim&&r[0]===e.TokenType.Delim)return s(new e.ParseError("Invalid cascade layer name. Layer name parts must not be empty.",i,l,o)),[]}r[0]===e.TokenType.Ident&&(c=!0),r[0]!==e.TokenType.Ident&&r[0]!==e.TokenType.Delim||(y=r)}if(!y)return s(new e.ParseError("Invalid cascade layer name. Empty layer name.",i,l,o)),[];if(y[0]===e.TokenType.Delim)return s(new e.ParseError("Invalid cascade layer name. Layer name must not end with a dot.",i,l,o)),[];p.push(new LayerName(m))}return p}exports.LayerName=LayerName,exports.addLayerToModel=function addLayerToModel(e,n){return n.forEach((n=>{const r=n.segments();e:for(let t=0;t<r.length;t++){const r=n.slice(0,t+1),a=r.segments();let s=-1,o=0;for(let n=0;n<e.length;n++){const r=e[n].segments();let t=0;n:for(let e=0;e<r.length;e++){const n=r[e],s=a[e];if(s===n&&e+1===a.length)continue e;if(s!==n){if(s!==n)break n}else t++}t>=o&&(s=n,o=t)}-1===s?e.push(r):e.splice(s+1,0,r)}})),e},exports.parse=function parse(n,r){const t=e.tokenizer({css:n},{onParseError:r?.onParseError}),a=[];for(;!t.endOfFile();)a.push(t.nextToken());return a.push(t.nextToken()),parseFromTokens(a,r)},exports.parseFromTokens=parseFromTokens;

},{"@csstools/css-parser-algorithms":2,"@csstools/css-tokenizer":3}],2:[function(require,module,exports){
"use strict";var e,n=require("@csstools/css-tokenizer");function walkerIndexGenerator(e){let n=e.slice();return(e,o,t)=>{let s=-1;for(let i=n.indexOf(o);i<n.length&&(s=e.indexOf(n[i]),-1===s||s<t);i++);return-1===s||s===t&&o===e[t]&&(s++,s>=e.length)?-1:(n=e.slice(),s)}}function consumeComponentValue(e,o){const t=o[0];if(t[0]===n.TokenType.OpenParen||t[0]===n.TokenType.OpenCurly||t[0]===n.TokenType.OpenSquare){const n=consumeSimpleBlock(e,o);return{advance:n.advance,node:n.node}}if(t[0]===n.TokenType.Function){const n=consumeFunction(e,o);return{advance:n.advance,node:n.node}}if(t[0]===n.TokenType.Whitespace){const n=consumeWhitespace(e,o);return{advance:n.advance,node:n.node}}if(t[0]===n.TokenType.Comment){const n=consumeComment(e,o);return{advance:n.advance,node:n.node}}return{advance:1,node:new TokenNode(t)}}exports.ComponentValueType=void 0,(e=exports.ComponentValueType||(exports.ComponentValueType={})).Function="function",e.SimpleBlock="simple-block",e.Whitespace="whitespace",e.Comment="comment",e.Token="token";class ContainerNodeBaseClass{value=[];indexOf(e){return this.value.indexOf(e)}at(e){if("number"==typeof e)return e<0&&(e=this.value.length+e),this.value[e]}forEach(e,n){if(0===this.value.length)return;const o=walkerIndexGenerator(this.value);let t=0;for(;t<this.value.length;){const s=this.value[t];let i;if(n&&(i={...n}),!1===e({node:s,parent:this,state:i},t))return!1;if(t=o(this.value,s,t),-1===t)break}}walk(e,n){0!==this.value.length&&this.forEach(((n,o)=>!1!==e(n,o)&&((!("walk"in n.node)||!this.value.includes(n.node)||!1!==n.node.walk(e,n.state))&&void 0)),n)}}class FunctionNode extends ContainerNodeBaseClass{type=exports.ComponentValueType.Function;name;endToken;constructor(e,n,o){super(),this.name=e,this.endToken=n,this.value=o}getName(){return this.name[4].value}normalize(){this.endToken[0]===n.TokenType.EOF&&(this.endToken=[n.TokenType.CloseParen,")",-1,-1,void 0])}tokens(){return this.endToken[0]===n.TokenType.EOF?[this.name,...this.value.flatMap((e=>e.tokens()))]:[this.name,...this.value.flatMap((e=>e.tokens())),this.endToken]}toString(){const e=this.value.map((e=>n.isToken(e)?n.stringify(e):e.toString())).join("");return n.stringify(this.name)+e+n.stringify(this.endToken)}toJSON(){return{type:this.type,name:this.getName(),tokens:this.tokens(),value:this.value.map((e=>e.toJSON()))}}isFunctionNode(){return FunctionNode.isFunctionNode(this)}static isFunctionNode(e){return!!e&&(e instanceof FunctionNode&&e.type===exports.ComponentValueType.Function)}}function consumeFunction(e,o){const t=[];let s=1;for(;;){const i=o[s];if(!i||i[0]===n.TokenType.EOF)return e.onParseError(new n.ParseError("Unexpected EOF while consuming a function.",o[0][2],o[o.length-1][3],["5.4.9. Consume a function","Unexpected EOF"])),{advance:o.length,node:new FunctionNode(o[0],i,t)};if(i[0]===n.TokenType.CloseParen)return{advance:s+1,node:new FunctionNode(o[0],i,t)};if(i[0]===n.TokenType.Comment||i[0]===n.TokenType.Whitespace){const n=consumeAllCommentsAndWhitespace(e,o.slice(s));s+=n.advance,t.push(...n.nodes);continue}const r=consumeComponentValue(e,o.slice(s));s+=r.advance,t.push(r.node)}}class SimpleBlockNode extends ContainerNodeBaseClass{type=exports.ComponentValueType.SimpleBlock;startToken;endToken;constructor(e,n,o){super(),this.startToken=e,this.endToken=n,this.value=o}normalize(){if(this.endToken[0]===n.TokenType.EOF){const e=n.mirrorVariant(this.startToken);e&&(this.endToken=e)}}tokens(){return this.endToken[0]===n.TokenType.EOF?[this.startToken,...this.value.flatMap((e=>e.tokens()))]:[this.startToken,...this.value.flatMap((e=>e.tokens())),this.endToken]}toString(){const e=this.value.map((e=>n.isToken(e)?n.stringify(e):e.toString())).join("");return n.stringify(this.startToken)+e+n.stringify(this.endToken)}indexOf(e){return this.value.indexOf(e)}at(e){if("number"==typeof e)return e<0&&(e=this.value.length+e),this.value[e]}toJSON(){return{type:this.type,startToken:this.startToken,tokens:this.tokens(),value:this.value.map((e=>e.toJSON()))}}isSimpleBlockNode(){return SimpleBlockNode.isSimpleBlockNode(this)}static isSimpleBlockNode(e){return!!e&&(e instanceof SimpleBlockNode&&e.type===exports.ComponentValueType.SimpleBlock)}}function consumeSimpleBlock(e,o){const t=n.mirrorVariantType(o[0][0]);if(!t)throw new Error("Failed to parse, a mirror variant must exist for all block open tokens.");const s=[];let i=1;for(;;){const r=o[i];if(!r||r[0]===n.TokenType.EOF)return e.onParseError(new n.ParseError("Unexpected EOF while consuming a simple block.",o[0][2],o[o.length-1][3],["5.4.8. Consume a simple block","Unexpected EOF"])),{advance:o.length,node:new SimpleBlockNode(o[0],r,s)};if(r[0]===t)return{advance:i+1,node:new SimpleBlockNode(o[0],r,s)};if(r[0]===n.TokenType.Comment||r[0]===n.TokenType.Whitespace){const n=consumeAllCommentsAndWhitespace(e,o.slice(i));i+=n.advance,s.push(...n.nodes);continue}const a=consumeComponentValue(e,o.slice(i));i+=a.advance,s.push(a.node)}}class WhitespaceNode{type=exports.ComponentValueType.Whitespace;value;constructor(e){this.value=e}tokens(){return this.value}toString(){return n.stringify(...this.value)}toJSON(){return{type:this.type,tokens:this.tokens()}}isWhitespaceNode(){return WhitespaceNode.isWhitespaceNode(this)}static isWhitespaceNode(e){return!!e&&(e instanceof WhitespaceNode&&e.type===exports.ComponentValueType.Whitespace)}}function consumeWhitespace(e,o){let t=0;for(;;){if(o[t][0]!==n.TokenType.Whitespace)return{advance:t,node:new WhitespaceNode(o.slice(0,t))};t++}}class CommentNode{type=exports.ComponentValueType.Comment;value;constructor(e){this.value=e}tokens(){return[this.value]}toString(){return n.stringify(this.value)}toJSON(){return{type:this.type,tokens:this.tokens()}}isCommentNode(){return CommentNode.isCommentNode(this)}static isCommentNode(e){return!!e&&(e instanceof CommentNode&&e.type===exports.ComponentValueType.Comment)}}function consumeComment(e,n){return{advance:1,node:new CommentNode(n[0])}}function consumeAllCommentsAndWhitespace(e,o){const t=[];let s=0;for(;;)if(o[s][0]!==n.TokenType.Whitespace){if(o[s][0]!==n.TokenType.Comment)return{advance:s,nodes:t};t.push(new CommentNode(o[s])),s++}else{const e=consumeWhitespace(0,o.slice(s));s+=e.advance,t.push(e.node)}}class TokenNode{type=exports.ComponentValueType.Token;value;constructor(e){this.value=e}tokens(){return[this.value]}toString(){return n.stringify(this.value)}toJSON(){return{type:this.type,tokens:this.tokens()}}isTokenNode(){return TokenNode.isTokenNode(this)}static isTokenNode(e){return!!e&&(e instanceof TokenNode&&e.type===exports.ComponentValueType.Token)}}function isSimpleBlockNode(e){return SimpleBlockNode.isSimpleBlockNode(e)}function isFunctionNode(e){return FunctionNode.isFunctionNode(e)}exports.CommentNode=CommentNode,exports.ContainerNodeBaseClass=ContainerNodeBaseClass,exports.FunctionNode=FunctionNode,exports.SimpleBlockNode=SimpleBlockNode,exports.TokenNode=TokenNode,exports.WhitespaceNode=WhitespaceNode,exports.gatherNodeAncestry=function gatherNodeAncestry(e){const n=new Map;return e.walk((e=>{Array.isArray(e.node)?e.node.forEach((o=>{n.set(o,e.parent)})):n.set(e.node,e.parent)})),n},exports.isCommentNode=function isCommentNode(e){return CommentNode.isCommentNode(e)},exports.isFunctionNode=isFunctionNode,exports.isSimpleBlockNode=isSimpleBlockNode,exports.isTokenNode=function isTokenNode(e){return TokenNode.isTokenNode(e)},exports.isWhitespaceNode=function isWhitespaceNode(e){return WhitespaceNode.isWhitespaceNode(e)},exports.parseCommaSeparatedListOfComponentValues=function parseCommaSeparatedListOfComponentValues(e,o){const t={onParseError:o?.onParseError??(()=>{})},s=[...e];if(0===e.length)return[];s[s.length-1][0]!==n.TokenType.EOF&&s.push([n.TokenType.EOF,"",s[s.length-1][2],s[s.length-1][3],void 0]);const i=[];let r=[],a=0;for(;;){if(!s[a]||s[a][0]===n.TokenType.EOF)return r.length&&i.push(r),i;if(s[a][0]===n.TokenType.Comma){i.push(r),r=[],a++;continue}const o=consumeComponentValue(t,e.slice(a));r.push(o.node),a+=o.advance}},exports.parseComponentValue=function parseComponentValue(e,o){const t={onParseError:o?.onParseError??(()=>{})},s=[...e];s[s.length-1][0]!==n.TokenType.EOF&&s.push([n.TokenType.EOF,"",s[s.length-1][2],s[s.length-1][3],void 0]);const i=consumeComponentValue(t,s);if(s[Math.min(i.advance,s.length-1)][0]===n.TokenType.EOF)return i.node;t.onParseError(new n.ParseError("Expected EOF after parsing a component value.",e[0][2],e[e.length-1][3],["5.3.9. Parse a component value","Expected EOF"]))},exports.parseListOfComponentValues=function parseListOfComponentValues(e,o){const t={onParseError:o?.onParseError??(()=>{})},s=[...e];s[s.length-1][0]!==n.TokenType.EOF&&s.push([n.TokenType.EOF,"",s[s.length-1][2],s[s.length-1][3],void 0]);const i=[];let r=0;for(;;){if(!s[r]||s[r][0]===n.TokenType.EOF)return i;const e=consumeComponentValue(t,s.slice(r));i.push(e.node),r+=e.advance}},exports.replaceComponentValues=function replaceComponentValues(e,n){for(let o=0;o<e.length;o++){const t=e[o];for(let e=0;e<t.length;e++){const o=t[e];{const s=n(o);if(s){t.splice(e,1,s);continue}}(isSimpleBlockNode(o)||isFunctionNode(o))&&o.walk(((e,o)=>{if("number"!=typeof o)return;const t=e.node,s=n(t);s&&e.parent.value.splice(o,1,s)}))}}return e},exports.sourceIndices=function sourceIndices(e){if(Array.isArray(e)){const n=e[0];if(!n)return[0,0];const o=e[e.length-1]||n;return[sourceIndices(n)[0],sourceIndices(o)[1]]}const n=e.tokens(),o=n[0],t=n[n.length-1];return o&&t?[o[2],t[3]]:[0,0]},exports.stringify=function stringify(e){return e.map((e=>e.map((e=>n.stringify(...e.tokens()))).join(""))).join(",")},exports.walkerIndexGenerator=walkerIndexGenerator;

},{"@csstools/css-tokenizer":3}],3:[function(require,module,exports){
"use strict";class ParseError extends Error{sourceStart;sourceEnd;parserState;constructor(e,o,n,r){super(e),this.name="ParseError",this.sourceStart=o,this.sourceEnd=n,this.parserState=r}}class Reader{cursor=0;source="";codePointSource=[];representationIndices=[-1];length=0;representationStart=0;representationEnd=-1;constructor(e){this.source=e;{let o=-1,n="";for(n of e)o+=n.length,this.codePointSource.push(n.codePointAt(0)),this.representationIndices.push(o)}this.length=this.codePointSource.length}advanceCodePoint(e=1){this.cursor=this.cursor+e,this.representationEnd=this.representationIndices[this.cursor]}readCodePoint(e=1){const o=this.codePointSource[this.cursor];return void 0!==o&&(this.cursor=this.cursor+e,this.representationEnd=this.representationIndices[this.cursor],o)}unreadCodePoint(e=1){this.cursor=this.cursor-e,this.representationEnd=this.representationIndices[this.cursor]}resetRepresentation(){this.representationStart=this.representationIndices[this.cursor]+1,this.representationEnd=-1}}var e,o,n;exports.TokenType=void 0,(e=exports.TokenType||(exports.TokenType={})).Comment="comment",e.AtKeyword="at-keyword-token",e.BadString="bad-string-token",e.BadURL="bad-url-token",e.CDC="CDC-token",e.CDO="CDO-token",e.Colon="colon-token",e.Comma="comma-token",e.Delim="delim-token",e.Dimension="dimension-token",e.EOF="EOF-token",e.Function="function-token",e.Hash="hash-token",e.Ident="ident-token",e.Number="number-token",e.Percentage="percentage-token",e.Semicolon="semicolon-token",e.String="string-token",e.URL="url-token",e.Whitespace="whitespace-token",e.OpenParen="(-token",e.CloseParen=")-token",e.OpenSquare="[-token",e.CloseSquare="]-token",e.OpenCurly="{-token",e.CloseCurly="}-token",e.UnicodeRange="unicode-range-token",exports.NumberType=void 0,(o=exports.NumberType||(exports.NumberType={})).Integer="integer",o.Number="number",function(e){e.Unrestricted="unrestricted",e.ID="id"}(n||(n={}));const r=Object.values(exports.TokenType);const t=39,i=42,s=8,c=13,a=9,u=58,d=44,p=64,P=127,S=33,C=12,T=46,l=62,k=45,f=31,m=69,h=101,E=123,v=40,x=91,y=60,g=10,I=11,O=95,U=1114111,w=0,D=35,R=37,A=43,L=34,N=65533,b=92,q=125,W=41,F=93,H=59,V=14,B=47,z=32,K=117,M=85,$=114,J=82,_=108,j=76,Q=63,G=48,X=70;function checkIfFourCodePointsWouldStartCDO(e){return e.codePointSource[e.cursor]===y&&e.codePointSource[e.cursor+1]===S&&e.codePointSource[e.cursor+2]===k&&e.codePointSource[e.cursor+3]===k}function isDigitCodePoint(e){return e>=48&&e<=57}function isUppercaseLetterCodePoint(e){return e>=65&&e<=90}function isLowercaseLetterCodePoint(e){return e>=97&&e<=122}function isHexDigitCodePoint(e){return isDigitCodePoint(e)||e>=97&&e<=102||e>=65&&e<=70}function isLetterCodePoint(e){return isLowercaseLetterCodePoint(e)||isUppercaseLetterCodePoint(e)}function isIdentStartCodePoint(e){return isLetterCodePoint(e)||isNonASCII_IdentCodePoint(e)||e===O}function isIdentCodePoint(e){return isIdentStartCodePoint(e)||isDigitCodePoint(e)||e===k}function isNonASCII_IdentCodePoint(e){return 183===e||8204===e||8205===e||8255===e||8256===e||8204===e||(192<=e&&e<=214||216<=e&&e<=246||248<=e&&e<=893||895<=e&&e<=8191||8304<=e&&e<=8591||11264<=e&&e<=12271||12289<=e&&e<=55295||63744<=e&&e<=64975||65008<=e&&e<=65533||e>=65536)}function isNewLine(e){return 10===e||13===e||12===e}function isWhitespace(e){return 32===e||10===e||9===e||13===e||12===e}function checkIfTwoCodePointsAreAValidEscape(e){return e.codePointSource[e.cursor]===b&&!isNewLine(e.codePointSource[e.cursor+1])}function checkIfThreeCodePointsWouldStartAnIdentSequence(e,o){return o.codePointSource[o.cursor]===k?o.codePointSource[o.cursor+1]===k||(!!isIdentStartCodePoint(o.codePointSource[o.cursor+1])||o.codePointSource[o.cursor+1]===b&&!isNewLine(o.codePointSource[o.cursor+2])):!!isIdentStartCodePoint(o.codePointSource[o.cursor])||checkIfTwoCodePointsAreAValidEscape(o)}function checkIfThreeCodePointsWouldStartANumber(e){return e.codePointSource[e.cursor]===A||e.codePointSource[e.cursor]===k?!!isDigitCodePoint(e.codePointSource[e.cursor+1])||e.codePointSource[e.cursor+1]===T&&isDigitCodePoint(e.codePointSource[e.cursor+2]):e.codePointSource[e.cursor]===T?isDigitCodePoint(e.codePointSource[e.cursor+1]):isDigitCodePoint(e.codePointSource[e.cursor])}function checkIfTwoCodePointsStartAComment(e){return e.codePointSource[e.cursor]===B&&e.codePointSource[e.cursor+1]===i}function checkIfThreeCodePointsWouldStartCDC(e){return e.codePointSource[e.cursor]===k&&e.codePointSource[e.cursor+1]===k&&e.codePointSource[e.cursor+2]===l}function consumeComment(e,o){for(o.advanceCodePoint(2);;){const n=o.readCodePoint();if(!1===n){e.onParseError(new ParseError("Unexpected EOF while consuming a comment.",o.representationStart,o.representationEnd,["4.3.2. Consume comments","Unexpected EOF"]));break}if(n===i&&(void 0!==o.codePointSource[o.cursor]&&o.codePointSource[o.cursor]===B)){o.advanceCodePoint();break}}return[exports.TokenType.Comment,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0]}function consumeEscapedCodePoint(e,o){const n=o.readCodePoint();if(!1===n)return e.onParseError(new ParseError("Unexpected EOF while consuming an escaped code point.",o.representationStart,o.representationEnd,["4.3.7. Consume an escaped code point","Unexpected EOF"])),N;if(isHexDigitCodePoint(n)){const e=[n];for(;void 0!==o.codePointSource[o.cursor]&&isHexDigitCodePoint(o.codePointSource[o.cursor])&&e.length<6;)e.push(o.codePointSource[o.cursor]),o.advanceCodePoint();isWhitespace(o.codePointSource[o.cursor])&&o.advanceCodePoint();const t=parseInt(String.fromCodePoint(...e),16);return 0===t?N:(r=t)>=55296&&r<=57343||t>U?N:t}var r;return n}function consumeIdentSequence(e,o){const n=[];for(;;)if(isIdentCodePoint(o.codePointSource[o.cursor]))n.push(o.codePointSource[o.cursor]),o.advanceCodePoint();else{if(!checkIfTwoCodePointsAreAValidEscape(o))return n;o.advanceCodePoint(),n.push(consumeEscapedCodePoint(e,o))}}function consumeHashToken(e,o){if(o.advanceCodePoint(),void 0!==o.codePointSource[o.cursor]&&(isIdentCodePoint(o.codePointSource[o.cursor])||checkIfTwoCodePointsAreAValidEscape(o))){let r=n.Unrestricted;checkIfThreeCodePointsWouldStartAnIdentSequence(0,o)&&(r=n.ID);const t=consumeIdentSequence(e,o);return[exports.TokenType.Hash,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCodePoint(...t),type:r}]}return[exports.TokenType.Delim,"#",o.representationStart,o.representationEnd,{value:"#"}]}function consumeNumber(e,o){let n=exports.NumberType.Integer;for(o.codePointSource[o.cursor]!==A&&o.codePointSource[o.cursor]!==k||o.advanceCodePoint();isDigitCodePoint(o.codePointSource[o.cursor]);)o.advanceCodePoint();if(o.codePointSource[o.cursor]===T&&isDigitCodePoint(o.codePointSource[o.cursor+1]))for(o.advanceCodePoint(2),n=exports.NumberType.Number;isDigitCodePoint(o.codePointSource[o.cursor]);)o.advanceCodePoint();if(o.codePointSource[o.cursor]===h||o.codePointSource[o.cursor]===m){if(isDigitCodePoint(o.codePointSource[o.cursor+1]))o.advanceCodePoint(2);else{if(o.codePointSource[o.cursor+1]!==k&&o.codePointSource[o.cursor+1]!==A||!isDigitCodePoint(o.codePointSource[o.cursor+2]))return n;o.advanceCodePoint(3)}for(n=exports.NumberType.Number;isDigitCodePoint(o.codePointSource[o.cursor]);)o.advanceCodePoint()}return n}function consumeNumericToken(e,o){let n;{const e=o.codePointSource[o.cursor];e===k?n="-":e===A&&(n="+")}const r=consumeNumber(0,o),t=parseFloat(o.source.slice(o.representationStart,o.representationEnd+1))||0;if(checkIfThreeCodePointsWouldStartAnIdentSequence(0,o)){const i=consumeIdentSequence(e,o);return[exports.TokenType.Dimension,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:t,signCharacter:n,type:r,unit:String.fromCodePoint(...i)}]}return o.codePointSource[o.cursor]===R?(o.advanceCodePoint(),[exports.TokenType.Percentage,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:t,signCharacter:n}]):[exports.TokenType.Number,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:t,signCharacter:n,type:r}]}function consumeWhiteSpace(e){for(;isWhitespace(e.codePointSource[e.cursor]);)e.advanceCodePoint();return[exports.TokenType.Whitespace,e.source.slice(e.representationStart,e.representationEnd+1),e.representationStart,e.representationEnd,void 0]}function consumeStringToken(e,o){let n="";const r=o.readCodePoint();for(;;){const t=o.readCodePoint();if(!1===t)return e.onParseError(new ParseError("Unexpected EOF while consuming a string token.",o.representationStart,o.representationEnd,["4.3.5. Consume a string token","Unexpected EOF"])),[exports.TokenType.String,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:n}];if(isNewLine(t))return e.onParseError(new ParseError("Unexpected newline while consuming a string token.",o.representationStart,o.representationEnd,["4.3.5. Consume a string token","Unexpected newline"])),o.unreadCodePoint(),[exports.TokenType.BadString,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0];if(t===r)return[exports.TokenType.String,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:n}];if(t!==b)n+=String.fromCodePoint(t);else{if(void 0===o.codePointSource[o.cursor])continue;if(isNewLine(o.codePointSource[o.cursor])){o.advanceCodePoint();continue}n+=String.fromCodePoint(consumeEscapedCodePoint(e,o))}}}function checkIfCodePointsMatchURLIdent(e){return!(3!==e.length||e[0]!==K&&e[0]!==M||e[1]!==$&&e[1]!==J||e[2]!==_&&e[2]!==j)}function consumeBadURL(e,o){for(;;){if(void 0===o.codePointSource[o.cursor])return;if(o.codePointSource[o.cursor]===W)return void o.advanceCodePoint();checkIfTwoCodePointsAreAValidEscape(o)?(o.advanceCodePoint(),consumeEscapedCodePoint(e,o)):o.advanceCodePoint()}}function consumeUrlToken(e,o){for(;isWhitespace(o.codePointSource[o.cursor]);)o.advanceCodePoint();let n="";for(;;){if(void 0===o.codePointSource[o.cursor])return e.onParseError(new ParseError("Unexpected EOF while consuming a url token.",o.representationStart,o.representationEnd,["4.3.6. Consume a url token","Unexpected EOF"])),[exports.TokenType.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:n}];if(o.codePointSource[o.cursor]===W)return o.advanceCodePoint(),[exports.TokenType.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:n}];if(isWhitespace(o.codePointSource[o.cursor])){for(o.advanceCodePoint();isWhitespace(o.codePointSource[o.cursor]);)o.advanceCodePoint();return void 0===o.codePointSource[o.cursor]?(e.onParseError(new ParseError("Unexpected EOF while consuming a url token.",o.representationStart,o.representationEnd,["4.3.6. Consume a url token","Consume as much whitespace as possible","Unexpected EOF"])),[exports.TokenType.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:n}]):o.codePointSource[o.cursor]===W?(o.advanceCodePoint(),[exports.TokenType.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:n}]):(consumeBadURL(e,o),[exports.TokenType.BadURL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0])}if(o.codePointSource[o.cursor]===L||o.codePointSource[o.cursor]===t||o.codePointSource[o.cursor]===v||((r=o.codePointSource[o.cursor])===I||r===P||w<=r&&r<=s||V<=r&&r<=f))return consumeBadURL(e,o),e.onParseError(new ParseError("Unexpected character while consuming a url token.",o.representationStart,o.representationEnd,["4.3.6. Consume a url token","Unexpected U+0022 QUOTATION MARK (\"), U+0027 APOSTROPHE ('), U+0028 LEFT PARENTHESIS (() or non-printable code point"])),[exports.TokenType.BadURL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0];if(o.codePointSource[o.cursor]===b){if(checkIfTwoCodePointsAreAValidEscape(o)){o.advanceCodePoint(),n+=String.fromCodePoint(consumeEscapedCodePoint(e,o));continue}return consumeBadURL(e,o),e.onParseError(new ParseError("Invalid escape sequence while consuming a url token.",o.representationStart,o.representationEnd,["4.3.6. Consume a url token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"])),[exports.TokenType.BadURL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0]}n+=String.fromCodePoint(o.codePointSource[o.cursor]),o.advanceCodePoint()}var r}function consumeIdentLikeToken(e,o){const n=consumeIdentSequence(e,o);if(o.codePointSource[o.cursor]!==v)return[exports.TokenType.Ident,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCodePoint(...n)}];if(checkIfCodePointsMatchURLIdent(n)){o.advanceCodePoint();let r=0;for(;;){const e=isWhitespace(o.codePointSource[o.cursor]),i=isWhitespace(o.codePointSource[o.cursor+1]);if(e&&i){r+=1,o.advanceCodePoint(1);continue}const s=e?o.codePointSource[o.cursor+1]:o.codePointSource[o.cursor];if(s===L||s===t)return r>0&&o.unreadCodePoint(r),[exports.TokenType.Function,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCodePoint(...n)}];break}return consumeUrlToken(e,o)}return o.advanceCodePoint(),[exports.TokenType.Function,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCodePoint(...n)}]}function checkIfThreeCodePointsWouldStartAUnicodeRange(e){return!(e.codePointSource[e.cursor]!==K&&e.codePointSource[e.cursor]!==M||e.codePointSource[e.cursor+1]!==A||e.codePointSource[e.cursor+2]!==Q&&!isHexDigitCodePoint(e.codePointSource[e.cursor+2]))}function consumeUnicodeRangeToken(e,o){o.advanceCodePoint(2);const n=[],r=[];for(;void 0!==o.codePointSource[o.cursor]&&n.length<6&&isHexDigitCodePoint(o.codePointSource[o.cursor]);)n.push(o.codePointSource[o.cursor]),o.advanceCodePoint();for(;void 0!==o.codePointSource[o.cursor]&&n.length<6&&o.codePointSource[o.cursor]===Q;)0===r.length&&r.push(...n),n.push(G),r.push(X),o.advanceCodePoint();if(!r.length&&o.codePointSource[o.cursor]===k&&isHexDigitCodePoint(o.codePointSource[o.cursor+1]))for(o.advanceCodePoint();void 0!==o.codePointSource[o.cursor]&&r.length<6&&isHexDigitCodePoint(o.codePointSource[o.cursor]);)r.push(o.codePointSource[o.cursor]),o.advanceCodePoint();if(!r.length){const e=parseInt(String.fromCodePoint(...n),16);return[exports.TokenType.UnicodeRange,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{startOfRange:e,endOfRange:e}]}const t=parseInt(String.fromCodePoint(...n),16),i=parseInt(String.fromCodePoint(...r),16);return[exports.TokenType.UnicodeRange,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{startOfRange:t,endOfRange:i}]}function tokenizer(e,o){const n=e.css.valueOf(),r=e.unicodeRangesAllowed??!1,i=new Reader(n),s={onParseError:o?.onParseError??(()=>{})};return{nextToken:function nextToken(){i.resetRepresentation();const e=i.codePointSource[i.cursor];if(void 0===e)return[exports.TokenType.EOF,"",-1,-1,void 0];if(e===B&&checkIfTwoCodePointsStartAComment(i))return consumeComment(s,i);if(r&&(e===K||e===M)&&checkIfThreeCodePointsWouldStartAUnicodeRange(i))return consumeUnicodeRangeToken(0,i);if(isIdentStartCodePoint(e))return consumeIdentLikeToken(s,i);if(isDigitCodePoint(e))return consumeNumericToken(s,i);switch(e){case d:return i.advanceCodePoint(),[exports.TokenType.Comma,",",i.representationStart,i.representationEnd,void 0];case u:return i.advanceCodePoint(),[exports.TokenType.Colon,":",i.representationStart,i.representationEnd,void 0];case H:return i.advanceCodePoint(),[exports.TokenType.Semicolon,";",i.representationStart,i.representationEnd,void 0];case v:return i.advanceCodePoint(),[exports.TokenType.OpenParen,"(",i.representationStart,i.representationEnd,void 0];case W:return i.advanceCodePoint(),[exports.TokenType.CloseParen,")",i.representationStart,i.representationEnd,void 0];case x:return i.advanceCodePoint(),[exports.TokenType.OpenSquare,"[",i.representationStart,i.representationEnd,void 0];case F:return i.advanceCodePoint(),[exports.TokenType.CloseSquare,"]",i.representationStart,i.representationEnd,void 0];case E:return i.advanceCodePoint(),[exports.TokenType.OpenCurly,"{",i.representationStart,i.representationEnd,void 0];case q:return i.advanceCodePoint(),[exports.TokenType.CloseCurly,"}",i.representationStart,i.representationEnd,void 0];case t:case L:return consumeStringToken(s,i);case D:return consumeHashToken(s,i);case A:case T:return checkIfThreeCodePointsWouldStartANumber(i)?consumeNumericToken(s,i):(i.advanceCodePoint(),[exports.TokenType.Delim,i.source[i.representationStart],i.representationStart,i.representationEnd,{value:i.source[i.representationStart]}]);case g:case c:case C:case a:case z:return consumeWhiteSpace(i);case k:return checkIfThreeCodePointsWouldStartANumber(i)?consumeNumericToken(s,i):checkIfThreeCodePointsWouldStartCDC(i)?(i.advanceCodePoint(3),[exports.TokenType.CDC,"--\x3e",i.representationStart,i.representationEnd,void 0]):checkIfThreeCodePointsWouldStartAnIdentSequence(0,i)?consumeIdentLikeToken(s,i):(i.advanceCodePoint(),[exports.TokenType.Delim,"-",i.representationStart,i.representationEnd,{value:"-"}]);case y:return checkIfFourCodePointsWouldStartCDO(i)?(i.advanceCodePoint(4),[exports.TokenType.CDO,"\x3c!--",i.representationStart,i.representationEnd,void 0]):(i.advanceCodePoint(),[exports.TokenType.Delim,"<",i.representationStart,i.representationEnd,{value:"<"}]);case p:if(i.advanceCodePoint(),checkIfThreeCodePointsWouldStartAnIdentSequence(0,i)){const e=consumeIdentSequence(s,i);return[exports.TokenType.AtKeyword,i.source.slice(i.representationStart,i.representationEnd+1),i.representationStart,i.representationEnd,{value:String.fromCodePoint(...e)}]}return[exports.TokenType.Delim,"@",i.representationStart,i.representationEnd,{value:"@"}];case b:return checkIfTwoCodePointsAreAValidEscape(i)?consumeIdentLikeToken(s,i):(i.advanceCodePoint(),s.onParseError(new ParseError('Invalid escape sequence after "\\"',i.representationStart,i.representationEnd,["4.3.1. Consume a token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"])),[exports.TokenType.Delim,"\\",i.representationStart,i.representationEnd,{value:"\\"}])}return i.advanceCodePoint(),[exports.TokenType.Delim,i.source[i.representationStart],i.representationStart,i.representationEnd,{value:i.source[i.representationStart]}]},endOfFile:function endOfFile(){return void 0===i.codePointSource[i.cursor]}}}exports.ParseError=ParseError,exports.Reader=Reader,exports.cloneTokens=function cloneTokens(e){return"undefined"!=typeof globalThis&&"structuredClone"in globalThis?structuredClone(e):JSON.parse(JSON.stringify(e))},exports.isToken=function isToken(e){return!!Array.isArray(e)&&(!(e.length<4)&&(!!r.includes(e[0])&&("string"==typeof e[1]&&("number"==typeof e[2]&&"number"==typeof e[3]))))},exports.mirrorVariant=function mirrorVariant(e){switch(e[0]){case exports.TokenType.OpenParen:return[exports.TokenType.CloseParen,")",-1,-1,void 0];case exports.TokenType.CloseParen:return[exports.TokenType.OpenParen,"(",-1,-1,void 0];case exports.TokenType.OpenCurly:return[exports.TokenType.CloseCurly,"}",-1,-1,void 0];case exports.TokenType.CloseCurly:return[exports.TokenType.OpenCurly,"{",-1,-1,void 0];case exports.TokenType.OpenSquare:return[exports.TokenType.CloseSquare,"]",-1,-1,void 0];case exports.TokenType.CloseSquare:return[exports.TokenType.OpenSquare,"[",-1,-1,void 0];default:return null}},exports.mirrorVariantType=function mirrorVariantType(e){switch(e){case exports.TokenType.OpenParen:return exports.TokenType.CloseParen;case exports.TokenType.CloseParen:return exports.TokenType.OpenParen;case exports.TokenType.OpenCurly:return exports.TokenType.CloseCurly;case exports.TokenType.CloseCurly:return exports.TokenType.OpenCurly;case exports.TokenType.OpenSquare:return exports.TokenType.CloseSquare;case exports.TokenType.CloseSquare:return exports.TokenType.OpenSquare;default:return null}},exports.mutateIdent=function mutateIdent(e,o){let n="";const r=[];{let e="";for(e of o)r.push(e.codePointAt(0))}let t=0;r[0]===k&&r[1]===k?(n="--",t=2):r[0]===k&&r[1]?(n="-",t=2,isIdentStartCodePoint(r[1])?n+=o[1]:n+=`\\${r[1].toString(16)} `):isIdentStartCodePoint(r[0])?(n=o[0],t=1):(n=`\\${r[0].toString(16)} `,t=1);for(let e=t;e<r.length;e++)isIdentCodePoint(r[e])?n+=o[e]:n+=`\\${r[e].toString(16)} `;e[1]=n,e[4].value=o},exports.stringify=function stringify(...e){let o="";for(let n=0;n<e.length;n++)o+=e[n][1];return o},exports.tokenize=function tokenize(e,o){const n=tokenizer(e,o),r=[];{for(;!n.endOfFile();){const e=n.nextToken();e&&r.push(e)}const e=n.nextToken();e&&r.push(e)}return r},exports.tokenizer=tokenizer;

},{}],4:[function(require,module,exports){
"use strict";var e,t=require("@csstools/css-parser-algorithms"),i=require("@csstools/css-tokenizer");exports.NodeType=void 0,(e=exports.NodeType||(exports.NodeType={})).CustomMedia="custom-media",e.GeneralEnclosed="general-enclosed",e.MediaAnd="media-and",e.MediaCondition="media-condition",e.MediaConditionListWithAnd="media-condition-list-and",e.MediaConditionListWithOr="media-condition-list-or",e.MediaFeature="media-feature",e.MediaFeatureBoolean="mf-boolean",e.MediaFeatureName="mf-name",e.MediaFeaturePlain="mf-plain",e.MediaFeatureRangeNameValue="mf-range-name-value",e.MediaFeatureRangeValueName="mf-range-value-name",e.MediaFeatureRangeValueNameValue="mf-range-value-name-value",e.MediaFeatureValue="mf-value",e.MediaInParens="media-in-parens",e.MediaNot="media-not",e.MediaOr="media-or",e.MediaQueryWithType="media-query-with-type",e.MediaQueryWithoutType="media-query-without-type",e.MediaQueryInvalid="media-query-invalid";const a=/[A-Z]/g;function toLowerCaseAZ(e){return e.replace(a,(e=>String.fromCharCode(e.charCodeAt(0)+32)))}class MediaCondition{type=exports.NodeType.MediaCondition;media;constructor(e){this.media=e}tokens(){return this.media.tokens()}toString(){return this.media.toString()}indexOf(e){return e===this.media?"media":-1}at(e){if("media"===e)return this.media}walk(e,t){let i;return t&&(i={...t}),!1!==e({node:this.media,parent:this,state:i},"media")&&this.media.walk(e,i)}toJSON(){return{type:this.type,media:this.media.toJSON()}}isMediaCondition(){return MediaCondition.isMediaCondition(this)}static isMediaCondition(e){return!!e&&(e instanceof MediaCondition&&e.type===exports.NodeType.MediaCondition)}}class MediaInParens{type=exports.NodeType.MediaInParens;media;before;after;constructor(e,t=[],i=[]){this.media=e,this.before=t,this.after=i}tokens(){return[...this.before,...this.media.tokens(),...this.after]}toString(){return i.stringify(...this.before)+this.media.toString()+i.stringify(...this.after)}indexOf(e){return e===this.media?"media":-1}at(e){if("media"===e)return this.media}walk(e,t){let i;return t&&(i={...t}),!1!==e({node:this.media,parent:this,state:i},"media")&&("walk"in this.media?this.media.walk(e,i):void 0)}toJSON(){return{type:this.type,media:this.media.toJSON(),before:this.before,after:this.after}}isMediaInParens(){return MediaInParens.isMediaInParens(this)}static isMediaInParens(e){return!!e&&(e instanceof MediaInParens&&e.type===exports.NodeType.MediaInParens)}}class MediaQueryWithType{type=exports.NodeType.MediaQueryWithType;modifier;mediaType;and=void 0;media=void 0;constructor(e,t,i,a){this.modifier=e,this.mediaType=t,i&&a&&(this.and=i,this.media=a)}getModifier(){if(!this.modifier.length)return"";for(let e=0;e<this.modifier.length;e++){const t=this.modifier[e];if(t[0]===i.TokenType.Ident)return t[4].value}return""}negateQuery(){const e=new MediaQueryWithType([...this.modifier],[...this.mediaType],this.and,this.media);if(0===e.modifier.length)return e.modifier=[[i.TokenType.Ident,"not",-1,-1,{value:"not"}],[i.TokenType.Whitespace," ",-1,-1,void 0]],e;for(let t=0;t<e.modifier.length;t++){const a=e.modifier[t];if(a[0]===i.TokenType.Ident&&"not"===toLowerCaseAZ(a[4].value)){e.modifier.splice(t,1);break}if(a[0]===i.TokenType.Ident&&"only"===toLowerCaseAZ(a[4].value)){a[1]="not",a[4].value="not";break}}return e}getMediaType(){if(!this.mediaType.length)return"";for(let e=0;e<this.mediaType.length;e++){const t=this.mediaType[e];if(t[0]===i.TokenType.Ident)return t[4].value}return""}tokens(){return this.and&&this.media?[...this.modifier,...this.mediaType,...this.and,...this.media.tokens()]:[...this.modifier,...this.mediaType]}toString(){return this.and&&this.media?i.stringify(...this.modifier)+i.stringify(...this.mediaType)+i.stringify(...this.and)+this.media.toString():i.stringify(...this.modifier)+i.stringify(...this.mediaType)}indexOf(e){return e===this.media?"media":-1}at(e){if("media"===e)return this.media}walk(e,t){let i;if(t&&(i={...t}),this.media)return!1!==e({node:this.media,parent:this,state:i},"media")&&this.media.walk(e,i)}toJSON(){return{type:this.type,string:this.toString(),modifier:this.modifier,mediaType:this.mediaType,and:this.and,media:this.media}}isMediaQueryWithType(){return MediaQueryWithType.isMediaQueryWithType(this)}static isMediaQueryWithType(e){return!!e&&(e instanceof MediaQueryWithType&&e.type===exports.NodeType.MediaQueryWithType)}}class MediaQueryWithoutType{type=exports.NodeType.MediaQueryWithoutType;media;constructor(e){this.media=e}negateQuery(){let e=this.media;if(e.media.type===exports.NodeType.MediaNot)return new MediaQueryWithoutType(new MediaCondition(e.media.media));e.media.type===exports.NodeType.MediaConditionListWithOr&&(e=new MediaCondition(new MediaInParens(e,[[i.TokenType.Whitespace," ",0,0,void 0],[i.TokenType.OpenParen,"(",0,0,void 0]],[[i.TokenType.CloseParen,")",0,0,void 0]])));return new MediaQueryWithType([[i.TokenType.Ident,"not",0,0,{value:"not"}],[i.TokenType.Whitespace," ",0,0,void 0]],[[i.TokenType.Ident,"all",0,0,{value:"all"}],[i.TokenType.Whitespace," ",0,0,void 0]],[[i.TokenType.Ident,"and",0,0,{value:"and"}]],e)}tokens(){return this.media.tokens()}toString(){return this.media.toString()}indexOf(e){return e===this.media?"media":-1}at(e){if("media"===e)return this.media}walk(e,t){let i;return t&&(i={...t}),!1!==e({node:this.media,parent:this,state:i},"media")&&this.media.walk(e,i)}toJSON(){return{type:this.type,string:this.toString(),media:this.media}}isMediaQueryWithoutType(){return MediaQueryWithoutType.isMediaQueryWithoutType(this)}static isMediaQueryWithoutType(e){return!!e&&(e instanceof MediaQueryWithoutType&&e.type===exports.NodeType.MediaQueryWithoutType)}}class MediaQueryInvalid{type=exports.NodeType.MediaQueryInvalid;media;constructor(e){this.media=e}negateQuery(){return new MediaQueryInvalid(this.media)}tokens(){return this.media.flatMap((e=>e.tokens()))}toString(){return this.media.map((e=>e.toString())).join("")}walk(e,i){if(0===this.media.length)return;const a=t.walkerIndexGenerator(this.media);let r=0;for(;r<this.media.length;){const t=this.media[r];let n;if(i&&(n={...i}),!1===e({node:t,parent:this,state:n},r))return!1;if("walk"in t&&this.media.includes(t)&&!1===t.walk(e,n))return!1;if(r=a(this.media,t,r),-1===r)break}}toJSON(){return{type:this.type,string:this.toString(),media:this.media}}isMediaQueryInvalid(){return MediaQueryInvalid.isMediaQueryInvalid(this)}static isMediaQueryInvalid(e){return!!e&&(e instanceof MediaQueryInvalid&&e.type===exports.NodeType.MediaQueryInvalid)}}class GeneralEnclosed{type=exports.NodeType.GeneralEnclosed;value;constructor(e){this.value=e}tokens(){return this.value.tokens()}toString(){return this.value.toString()}indexOf(e){return e===this.value?"value":-1}at(e){if("value"===e)return this.value}walk(e,t){let i;return t&&(i={...t}),!1!==e({node:this.value,parent:this,state:i},"value")&&("walk"in this.value?this.value.walk(e,i):void 0)}toJSON(){return{type:this.type,tokens:this.tokens()}}isGeneralEnclosed(){return GeneralEnclosed.isGeneralEnclosed(this)}static isGeneralEnclosed(e){return!!e&&(e instanceof GeneralEnclosed&&e.type===exports.NodeType.GeneralEnclosed)}}class MediaAnd{type=exports.NodeType.MediaAnd;modifier;media;constructor(e,t){this.modifier=e,this.media=t}tokens(){return[...this.modifier,...this.media.tokens()]}toString(){return i.stringify(...this.modifier)+this.media.toString()}indexOf(e){return e===this.media?"media":-1}at(e){return"media"===e?this.media:null}walk(e,t){let i;return t&&(i={...t}),!1!==e({node:this.media,parent:this,state:i},"media")&&this.media.walk(e,i)}toJSON(){return{type:this.type,modifier:this.modifier,media:this.media.toJSON()}}isMediaAnd(){return MediaAnd.isMediaAnd(this)}static isMediaAnd(e){return!!e&&(e instanceof MediaAnd&&e.type===exports.NodeType.MediaAnd)}}class MediaConditionListWithAnd{type=exports.NodeType.MediaConditionListWithAnd;leading;list;before;after;constructor(e,t,i=[],a=[]){this.leading=e,this.list=t,this.before=i,this.after=a}tokens(){return[...this.before,...this.leading.tokens(),...this.list.flatMap((e=>e.tokens())),...this.after]}toString(){return i.stringify(...this.before)+this.leading.toString()+this.list.map((e=>e.toString())).join("")+i.stringify(...this.after)}indexOf(e){return e===this.leading?"leading":"media-and"===e.type?this.list.indexOf(e):-1}at(e){return"leading"===e?this.leading:"number"==typeof e?(e<0&&(e=this.list.length+e),this.list[e]):void 0}walk(e,i){let a;if(i&&(a={...i}),!1===e({node:this.leading,parent:this,state:a},"leading"))return!1;if("walk"in this.leading&&!1===this.leading.walk(e,a))return!1;if(0===this.list.length)return;const r=t.walkerIndexGenerator(this.list);let n=0;for(;n<this.list.length;){const t=this.list[n];if(i&&(a={...i}),!1===e({node:t,parent:this,state:a},n))return!1;if("walk"in t&&this.list.includes(t)&&!1===t.walk(e,a))return!1;if(n=r(this.list,t,n),-1===n)break}}toJSON(){return{type:this.type,leading:this.leading.toJSON(),list:this.list.map((e=>e.toJSON())),before:this.before,after:this.after}}isMediaConditionListWithAnd(){return MediaConditionListWithAnd.isMediaConditionListWithAnd(this)}static isMediaConditionListWithAnd(e){return!!e&&(e instanceof MediaConditionListWithAnd&&e.type===exports.NodeType.MediaConditionListWithAnd)}}class MediaConditionListWithOr{type=exports.NodeType.MediaConditionListWithOr;leading;list;before;after;constructor(e,t,i=[],a=[]){this.leading=e,this.list=t,this.before=i,this.after=a}tokens(){return[...this.before,...this.leading.tokens(),...this.list.flatMap((e=>e.tokens())),...this.after]}toString(){return i.stringify(...this.before)+this.leading.toString()+this.list.map((e=>e.toString())).join("")+i.stringify(...this.after)}indexOf(e){return e===this.leading?"leading":"media-or"===e.type?this.list.indexOf(e):-1}at(e){return"leading"===e?this.leading:"number"==typeof e?(e<0&&(e=this.list.length+e),this.list[e]):void 0}walk(e,i){let a;if(i&&(a={...i}),!1===e({node:this.leading,parent:this,state:a},"leading"))return!1;if("walk"in this.leading&&!1===this.leading.walk(e,a))return!1;if(0===this.list.length)return;const r=t.walkerIndexGenerator(this.list);let n=0;for(;n<this.list.length;){const t=this.list[n];if(i&&(a={...i}),!1===e({node:t,parent:this,state:a},n))return!1;if("walk"in t&&this.list.includes(t)&&!1===t.walk(e,a))return!1;if(n=r(this.list,t,n),-1===n)break}}toJSON(){return{type:this.type,leading:this.leading.toJSON(),list:this.list.map((e=>e.toJSON())),before:this.before,after:this.after}}isMediaConditionListWithOr(){return MediaConditionListWithOr.isMediaConditionListWithOr(this)}static isMediaConditionListWithOr(e){return!!e&&(e instanceof MediaConditionListWithOr&&e.type===exports.NodeType.MediaConditionListWithOr)}}function isNumber(e){return!!(e.type===t.ComponentValueType.Token&&e.value[0]===i.TokenType.Number||e.type===t.ComponentValueType.Function&&r.has(toLowerCaseAZ(e.name[4].value)))}const r=new Set(["abs","acos","asin","atan","atan2","calc","clamp","cos","exp","hypot","log","max","min","mod","pow","rem","round","sign","sin","sqrt","tan"]);function isDimension(e){return e.type===t.ComponentValueType.Token&&e.value[0]===i.TokenType.Dimension}function isIdent(e){return e.type===t.ComponentValueType.Token&&e.value[0]===i.TokenType.Ident}function isEnvironmentVariable(e){return e.type===t.ComponentValueType.Function&&"env"===toLowerCaseAZ(e.name[4].value)}class MediaFeatureName{type=exports.NodeType.MediaFeatureName;name;before;after;constructor(e,t=[],i=[]){this.name=e,this.before=t,this.after=i}getName(){return this.name.value[4].value}getNameToken(){return this.name.value}tokens(){return[...this.before,...this.name.tokens(),...this.after]}toString(){return i.stringify(...this.before)+this.name.toString()+i.stringify(...this.after)}indexOf(e){return e===this.name?"name":-1}at(e){if("name"===e)return this.name}toJSON(){return{type:this.type,name:this.getName(),tokens:this.tokens()}}isMediaFeatureName(){return MediaFeatureName.isMediaFeatureName(this)}static isMediaFeatureName(e){return!!e&&(e instanceof MediaFeatureName&&e.type===exports.NodeType.MediaFeatureName)}}function parseMediaFeatureName(e){let i=-1;for(let a=0;a<e.length;a++){const r=e[a];if(r.type!==t.ComponentValueType.Whitespace&&r.type!==t.ComponentValueType.Comment){if(!isIdent(r))return!1;if(-1!==i)return!1;i=a}}return-1!==i&&new MediaFeatureName(e[i],e.slice(0,i).flatMap((e=>e.tokens())),e.slice(i+1).flatMap((e=>e.tokens())))}class MediaFeatureBoolean{type=exports.NodeType.MediaFeatureBoolean;name;constructor(e){this.name=e}getName(){return this.name.getName()}getNameToken(){return this.name.getNameToken()}tokens(){return this.name.tokens()}toString(){return this.name.toString()}indexOf(e){return e===this.name?"name":-1}at(e){if("name"===e)return this.name}toJSON(){return{type:this.type,name:this.name.toJSON(),tokens:this.tokens()}}isMediaFeatureBoolean(){return MediaFeatureBoolean.isMediaFeatureBoolean(this)}static isMediaFeatureBoolean(e){return!!e&&(e instanceof MediaFeatureBoolean&&e.type===exports.NodeType.MediaFeatureBoolean)}}function parseMediaFeatureBoolean(e){const t=parseMediaFeatureName(e);return!1===t?t:new MediaFeatureBoolean(t)}class MediaFeatureValue{type=exports.NodeType.MediaFeatureValue;value;before;after;constructor(e,t=[],i=[]){Array.isArray(e)&&1===e.length?this.value=e[0]:this.value=e,this.before=t,this.after=i}tokens(){return Array.isArray(this.value)?[...this.before,...this.value.flatMap((e=>e.tokens())),...this.after]:[...this.before,...this.value.tokens(),...this.after]}toString(){return Array.isArray(this.value)?i.stringify(...this.before)+this.value.map((e=>e.toString())).join("")+i.stringify(...this.after):i.stringify(...this.before)+this.value.toString()+i.stringify(...this.after)}indexOf(e){return e===this.value?"value":-1}at(e){return"value"===e?this.value:Array.isArray(this.value)&&"number"==typeof e?(e<0&&(e=this.value.length+e),this.value[e]):void 0}walk(e,i){if(Array.isArray(this.value)){if(0===this.value.length)return;const a=t.walkerIndexGenerator(this.value);let r=0;for(;r<this.value.length;){const t=this.value[r];let n;if(i&&(n={...i}),!1===e({node:t,parent:this,state:n},r))return!1;if("walk"in t&&this.value.includes(t)&&!1===t.walk(e,n))return!1;if(r=a(this.value,t,r),-1===r)break}}else{let t;if(i&&(t={...i}),!1===e({node:this.value,parent:this,state:t},"value"))return!1;if("walk"in this.value)return this.value.walk(e,t)}}toJSON(){return Array.isArray(this.value)?{type:this.type,value:this.value.map((e=>e.toJSON())),tokens:this.tokens()}:{type:this.type,value:this.value.toJSON(),tokens:this.tokens()}}isMediaFeatureValue(){return MediaFeatureValue.isMediaFeatureValue(this)}static isMediaFeatureValue(e){return!!e&&(e instanceof MediaFeatureValue&&e.type===exports.NodeType.MediaFeatureValue)}}function parseMediaFeatureValue(e,i=!1){let a=-1,r=-1;for(let n=0;n<e.length;n++){const s=e[n];if(s.type!==t.ComponentValueType.Whitespace&&s.type!==t.ComponentValueType.Comment){if(-1!==a)return!1;if(isNumber(s)){const t=matchesRatioExactly(e.slice(n));if(-1!==t){a=t[0]+n,r=t[1]+n,n+=t[1]-t[0];continue}a=n,r=n}else if(isEnvironmentVariable(s))a=n,r=n;else if(isDimension(s))a=n,r=n;else{if(i||!isIdent(s))return!1;a=n,r=n}}}return-1!==a&&new MediaFeatureValue(e.slice(a,r+1),e.slice(0,a).flatMap((e=>e.tokens())),e.slice(r+1).flatMap((e=>e.tokens())))}function matchesRatioExactly(e){let t=-1,i=-1;const a=matchesRatio(e);if(-1===a)return-1;t=a[0],i=a[1];for(let t=i+1;t<e.length;t++){const i=e[t];if("whitespace"!==i.type&&"comment"!==i.type)return-1}return[t,i]}function matchesRatio(e){let t=-1,a=-1;for(let r=0;r<e.length;r++){const n=e[r];if("whitespace"!==n.type&&"comment"!==n.type){if("token"===n.type){const e=n.value;if(e[0]===i.TokenType.Delim&&"/"===e[4].value){if(-1===t)return-1;if(-1!==a)return-1;a=r;continue}}if(!isNumber(n))return-1;if(-1!==a)return[t,r];if(-1!==t)return-1;t=r}}return-1}class MediaFeaturePlain{type=exports.NodeType.MediaFeaturePlain;name;colon;value;constructor(e,t,i){this.name=e,this.colon=t,this.value=i}getName(){return this.name.getName()}getNameToken(){return this.name.getNameToken()}tokens(){return[...this.name.tokens(),this.colon,...this.value.tokens()]}toString(){return this.name.toString()+i.stringify(this.colon)+this.value.toString()}indexOf(e){return e===this.name?"name":e===this.value?"value":-1}at(e){return"name"===e?this.name:"value"===e?this.value:void 0}walk(e,t){let i;return t&&(i={...t}),!1!==e({node:this.value,parent:this,state:i},"value")&&this.value.walk(e,i)}toJSON(){return{type:this.type,name:this.name.toJSON(),value:this.value.toJSON(),tokens:this.tokens()}}isMediaFeaturePlain(){return MediaFeaturePlain.isMediaFeaturePlain(this)}static isMediaFeaturePlain(e){return!!e&&(e instanceof MediaFeaturePlain&&e.type===exports.NodeType.MediaFeaturePlain)}}function parseMediaFeaturePlain(e){let a=[],r=[],n=null;for(let s=0;s<e.length;s++){const o=e[s];if(o.type===t.ComponentValueType.Token){const t=o.value;if(t[0]===i.TokenType.Colon){a=e.slice(0,s),r=e.slice(s+1),n=t;break}}}if(!a.length||!r.length||!n)return!1;const s=parseMediaFeatureName(a);if(!1===s)return!1;const o=parseMediaFeatureValue(r);return!1!==o&&new MediaFeaturePlain(s,n,o)}var n,s,o,u;function matchesComparison(e){let a=-1;for(let r=0;r<e.length;r++){const n=e[r];if(n.type===t.ComponentValueType.Token){const e=n.value;if(e[0]===i.TokenType.Delim){if(e[4].value===exports.MediaFeatureEQ.EQ)return-1!==a?[a,r]:[r,r];if(e[4].value===exports.MediaFeatureLT.LT){a=r;continue}if(e[4].value===exports.MediaFeatureGT.GT){a=r;continue}}}break}return-1!==a&&[a,a]}function comparisonFromTokens(e){if(0===e.length||e.length>2)return!1;if(e[0][0]!==i.TokenType.Delim)return!1;if(1===e.length)switch(e[0][4].value){case exports.MediaFeatureEQ.EQ:return exports.MediaFeatureEQ.EQ;case exports.MediaFeatureLT.LT:return exports.MediaFeatureLT.LT;case exports.MediaFeatureGT.GT:return exports.MediaFeatureGT.GT;default:return!1}if(e[1][0]!==i.TokenType.Delim)return!1;if(e[1][4].value!==exports.MediaFeatureEQ.EQ)return!1;switch(e[0][4].value){case exports.MediaFeatureLT.LT:return exports.MediaFeatureLT.LT_OR_EQ;case exports.MediaFeatureGT.GT:return exports.MediaFeatureGT.GT_OR_EQ;default:return!1}}exports.MediaFeatureLT=void 0,(n=exports.MediaFeatureLT||(exports.MediaFeatureLT={})).LT="<",n.LT_OR_EQ="<=",exports.MediaFeatureGT=void 0,(s=exports.MediaFeatureGT||(exports.MediaFeatureGT={})).GT=">",s.GT_OR_EQ=">=",exports.MediaFeatureEQ=void 0,(exports.MediaFeatureEQ||(exports.MediaFeatureEQ={})).EQ="=";class MediaFeatureRangeNameValue{type=exports.NodeType.MediaFeatureRangeNameValue;name;operator;value;constructor(e,t,i){this.name=e,this.operator=t,this.value=i}operatorKind(){return comparisonFromTokens(this.operator)}getName(){return this.name.getName()}getNameToken(){return this.name.getNameToken()}tokens(){return[...this.name.tokens(),...this.operator,...this.value.tokens()]}toString(){return this.name.toString()+i.stringify(...this.operator)+this.value.toString()}indexOf(e){return e===this.name?"name":e===this.value?"value":-1}at(e){return"name"===e?this.name:"value"===e?this.value:void 0}walk(e,t){let i;return t&&(i={...t}),!1!==e({node:this.value,parent:this,state:i},"value")&&("walk"in this.value?this.value.walk(e,i):void 0)}toJSON(){return{type:this.type,name:this.name.toJSON(),value:this.value.toJSON(),tokens:this.tokens()}}isMediaFeatureRangeNameValue(){return MediaFeatureRangeNameValue.isMediaFeatureRangeNameValue(this)}static isMediaFeatureRangeNameValue(e){return!!e&&(e instanceof MediaFeatureRangeNameValue&&e.type===exports.NodeType.MediaFeatureRangeNameValue)}}class MediaFeatureRangeValueName{type=exports.NodeType.MediaFeatureRangeValueName;name;operator;value;constructor(e,t,i){this.name=e,this.operator=t,this.value=i}operatorKind(){return comparisonFromTokens(this.operator)}getName(){return this.name.getName()}getNameToken(){return this.name.getNameToken()}tokens(){return[...this.value.tokens(),...this.operator,...this.name.tokens()]}toString(){return this.value.toString()+i.stringify(...this.operator)+this.name.toString()}indexOf(e){return e===this.name?"name":e===this.value?"value":-1}at(e){return"name"===e?this.name:"value"===e?this.value:void 0}walk(e,t){let i;return t&&(i={...t}),!1!==e({node:this.value,parent:this,state:i},"value")&&("walk"in this.value?this.value.walk(e,i):void 0)}toJSON(){return{type:this.type,name:this.name.toJSON(),value:this.value.toJSON(),tokens:this.tokens()}}isMediaFeatureRangeValueName(){return MediaFeatureRangeValueName.isMediaFeatureRangeValueName(this)}static isMediaFeatureRangeValueName(e){return!!e&&(e instanceof MediaFeatureRangeValueName&&e.type===exports.NodeType.MediaFeatureRangeValueName)}}class MediaFeatureRangeValueNameValue{type=exports.NodeType.MediaFeatureRangeValueNameValue;name;valueOne;valueOneOperator;valueTwo;valueTwoOperator;constructor(e,t,i,a,r){this.name=e,this.valueOne=t,this.valueOneOperator=i,this.valueTwo=a,this.valueTwoOperator=r}valueOneOperatorKind(){return comparisonFromTokens(this.valueOneOperator)}valueTwoOperatorKind(){return comparisonFromTokens(this.valueTwoOperator)}getName(){return this.name.getName()}getNameToken(){return this.name.getNameToken()}tokens(){return[...this.valueOne.tokens(),...this.valueOneOperator,...this.name.tokens(),...this.valueTwoOperator,...this.valueTwo.tokens()]}toString(){return this.valueOne.toString()+i.stringify(...this.valueOneOperator)+this.name.toString()+i.stringify(...this.valueTwoOperator)+this.valueTwo.toString()}indexOf(e){return e===this.name?"name":e===this.valueOne?"valueOne":e===this.valueTwo?"valueTwo":-1}at(e){return"name"===e?this.name:"valueOne"===e?this.valueOne:"valueTwo"===e?this.valueTwo:void 0}walk(e,t){let i;return t&&(i={...t}),!1!==e({node:this.valueOne,parent:this,state:i},"valueOne")&&((!("walk"in this.valueOne)||!1!==this.valueOne.walk(e,i))&&(t&&(i={...t}),!1!==e({node:this.valueTwo,parent:this,state:i},"valueTwo")&&((!("walk"in this.valueTwo)||!1!==this.valueTwo.walk(e,i))&&void 0)))}toJSON(){return{type:this.type,name:this.name.toJSON(),valueOne:this.valueOne.toJSON(),valueTwo:this.valueTwo.toJSON(),tokens:this.tokens()}}isMediaFeatureRangeValueNameValue(){return MediaFeatureRangeValueNameValue.isMediaFeatureRangeValueNameValue(this)}static isMediaFeatureRangeValueNameValue(e){return!!e&&(e instanceof MediaFeatureRangeValueNameValue&&e.type===exports.NodeType.MediaFeatureRangeValueNameValue)}}function parseMediaFeatureRange(e){let a=!1,r=!1;for(let n=0;n<e.length;n++){const s=e[n];if(s.type===t.ComponentValueType.Token){if(s.value[0]===i.TokenType.Delim){const t=matchesComparison(e.slice(n));if(!1!==t){if(!1!==a){r=[t[0]+n,t[1]+n];break}a=[t[0]+n,t[1]+n],n+=t[1]}}}}if(!1===a)return!1;const n=[e[a[0]].value];if(a[0]!==a[1]&&n.push(e[a[1]].value),!1===r){const t=e.slice(0,a[0]),i=e.slice(a[1]+1),r=parseMediaFeatureName(t);if(r){const e=parseMediaFeatureValue(i,!0);return!!e&&new MediaFeatureRangeNameValue(r,n,e)}const s=parseMediaFeatureName(i);if(s){const e=parseMediaFeatureValue(t,!0);return!!e&&new MediaFeatureRangeValueName(s,n,e)}return!1}const s=[e[r[0]].value];r[0]!==r[1]&&s.push(e[r[1]].value);const o=e.slice(0,a[0]),u=e.slice(a[1]+1,r[0]),d=e.slice(r[1]+1),l=parseMediaFeatureValue(o,!0),p=parseMediaFeatureName(u),h=parseMediaFeatureValue(d,!0);if(!l||!p||!h)return!1;{const e=comparisonFromTokens(n);if(!1===e||e===exports.MediaFeatureEQ.EQ)return!1;const t=comparisonFromTokens(s);if(!1===t||t===exports.MediaFeatureEQ.EQ)return!1;if(!(e!==exports.MediaFeatureLT.LT&&e!==exports.MediaFeatureLT.LT_OR_EQ||t!==exports.MediaFeatureGT.GT&&t!==exports.MediaFeatureGT.GT_OR_EQ))return!1;if(!(e!==exports.MediaFeatureGT.GT&&e!==exports.MediaFeatureGT.GT_OR_EQ||t!==exports.MediaFeatureLT.LT&&t!==exports.MediaFeatureLT.LT_OR_EQ))return!1}return new MediaFeatureRangeValueNameValue(p,l,n,h,s)}class MediaFeature{type=exports.NodeType.MediaFeature;feature;before;after;constructor(e,t=[],i=[]){this.feature=e,this.before=t,this.after=i}getName(){return this.feature.getName()}getNameToken(){return this.feature.getNameToken()}tokens(){return[...this.before,...this.feature.tokens(),...this.after]}toString(){return i.stringify(...this.before)+this.feature.toString()+i.stringify(...this.after)}indexOf(e){return e===this.feature?"feature":-1}at(e){if("feature"===e)return this.feature}walk(e,t){let i;return t&&(i={...t}),!1!==e({node:this.feature,parent:this,state:i},"feature")&&("walk"in this.feature?this.feature.walk(e,i):void 0)}toJSON(){return{type:this.type,feature:this.feature.toJSON(),before:this.before,after:this.after}}isMediaFeature(){return MediaFeature.isMediaFeature(this)}static isMediaFeature(e){return!!e&&(e instanceof MediaFeature&&e.type===exports.NodeType.MediaFeature)}}function parseMediaFeature(e,t=[],a=[]){if(e.startToken[0]!==i.TokenType.OpenParen)return!1;const r=parseMediaFeatureBoolean(e.value);if(!1!==r)return new MediaFeature(r,t,a);const n=parseMediaFeaturePlain(e.value);if(!1!==n)return new MediaFeature(n,t,a);const s=parseMediaFeatureRange(e.value);return!1!==s&&new MediaFeature(s,t,a)}class MediaNot{type=exports.NodeType.MediaNot;modifier;media;constructor(e,t){this.modifier=e,this.media=t}tokens(){return[...this.modifier,...this.media.tokens()]}toString(){return i.stringify(...this.modifier)+this.media.toString()}indexOf(e){return e===this.media?"media":-1}at(e){if("media"===e)return this.media}walk(e,t){let i;return t&&(i={...t}),!1!==e({node:this.media,parent:this,state:i},"media")&&this.media.walk(e,i)}toJSON(){return{type:this.type,modifier:this.modifier,media:this.media.toJSON()}}isMediaNot(){return MediaNot.isMediaNot(this)}static isMediaNot(e){return!!e&&(e instanceof MediaNot&&e.type===exports.NodeType.MediaNot)}}class MediaOr{type=exports.NodeType.MediaOr;modifier;media;constructor(e,t){this.modifier=e,this.media=t}tokens(){return[...this.modifier,...this.media.tokens()]}toString(){return i.stringify(...this.modifier)+this.media.toString()}indexOf(e){return e===this.media?"media":-1}at(e){if("media"===e)return this.media}walk(e,t){let i;return t&&(i={...t}),!1!==e({node:this.media,parent:this,state:i},"media")&&this.media.walk(e,i)}toJSON(){return{type:this.type,modifier:this.modifier,media:this.media.toJSON()}}isMediaOr(){return MediaOr.isMediaOr(this)}static isMediaOr(e){return!!e&&(e instanceof MediaOr&&e.type===exports.NodeType.MediaOr)}}function modifierFromToken(e){if(e[0]!==i.TokenType.Ident)return!1;switch(toLowerCaseAZ(e[4].value)){case exports.MediaQueryModifier.Not:return exports.MediaQueryModifier.Not;case exports.MediaQueryModifier.Only:return exports.MediaQueryModifier.Only;default:return!1}}function parseMediaQuery(e){{const t=parseMediaCondition(e);if(!1!==t)return new MediaQueryWithoutType(t)}{let a=-1,r=-1,n=-1;for(let s=0;s<e.length;s++){const o=e[s];if(!t.isWhitespaceNode(o)&&!t.isCommentNode(o)){if(t.isTokenNode(o)){const t=o.value;if(-1===a&&t[0]===i.TokenType.Ident&&modifierFromToken(t)){a=s;continue}if(-1===r&&t[0]===i.TokenType.Ident&&!modifierFromToken(t)){r=s;continue}if(-1===n&&t[0]===i.TokenType.Ident&&"and"===toLowerCaseAZ(t[4].value)){n=s;if(!1===parseMediaConditionWithoutOr(e.slice(s+1)))return!1;break}return!1}return!1}}let s=[],o=[];-1!==a?(s=e.slice(0,a+1).flatMap((e=>e.tokens())),-1!==r&&(o=e.slice(a+1,r+1).flatMap((e=>e.tokens())))):-1!==r&&(o=e.slice(0,r+1).flatMap((e=>e.tokens())));const u=parseMediaConditionWithoutOr(e.slice(Math.max(a,r,n)+1));return!1===u?new MediaQueryWithType(s,[...o,...e.slice(r+1).flatMap((e=>e.tokens()))]):new MediaQueryWithType(s,o,e.slice(r+1,n+1).flatMap((e=>e.tokens())),u)}}function parseMediaConditionListWithOr(e){let i=!1;const a=[];let r=-1,n=-1;for(let s=0;s<e.length;s++){if(i){const t=parseMediaOr(e.slice(s));if(!1!==t){s+=t.advance,a.push(t.node),n=s;continue}}const o=e[s];if(o.type!==t.ComponentValueType.Whitespace&&o.type!==t.ComponentValueType.Comment){if(i)return!1;if(!1!==i||!t.isSimpleBlockNode(o))return!1;if(o.normalize(),i=parseMediaInParensFromSimpleBlock(o),!1===i)return!1;r=s}}return!(!i||!a.length)&&new MediaConditionListWithOr(i,a,e.slice(0,r).flatMap((e=>e.tokens())),e.slice(n+1).flatMap((e=>e.tokens())))}function parseMediaConditionListWithAnd(e){let i=!1;const a=[];let r=-1,n=-1;for(let s=0;s<e.length;s++){if(i){const t=parseMediaAnd(e.slice(s));if(!1!==t){s+=t.advance,a.push(t.node),n=s;continue}}const o=e[s];if(o.type!==t.ComponentValueType.Whitespace&&o.type!==t.ComponentValueType.Comment){if(i)return!1;if(!1!==i||!t.isSimpleBlockNode(o))return!1;if(o.normalize(),i=parseMediaInParensFromSimpleBlock(o),!1===i)return!1;r=s}}return!(!i||!a.length)&&new MediaConditionListWithAnd(i,a,e.slice(0,r).flatMap((e=>e.tokens())),e.slice(n+1).flatMap((e=>e.tokens())))}function parseMediaCondition(e){const t=parseMediaNot(e);if(!1!==t)return new MediaCondition(t);const i=parseMediaConditionListWithAnd(e);if(!1!==i)return new MediaCondition(i);const a=parseMediaConditionListWithOr(e);if(!1!==a)return new MediaCondition(a);const r=parseMediaInParens(e);return!1!==r&&new MediaCondition(r)}function parseMediaConditionWithoutOr(e){const t=parseMediaNot(e);if(!1!==t)return new MediaCondition(t);const i=parseMediaConditionListWithAnd(e);if(!1!==i)return new MediaCondition(i);const a=parseMediaInParens(e);return!1!==a&&new MediaCondition(a)}function parseMediaInParens(e){let a=-1;for(let i=0;i<e.length;i++){const r=e[i];if(r.type!==t.ComponentValueType.Whitespace&&r.type!==t.ComponentValueType.Comment){if(!t.isSimpleBlockNode(r))return!1;if(-1!==a)return!1;a=i}}if(-1===a)return!1;const r=e[a];if(r.startToken[0]!==i.TokenType.OpenParen)return!1;r.normalize();const n=[...e.slice(0,a).flatMap((e=>e.tokens())),r.startToken],s=[r.endToken,...e.slice(a+1).flatMap((e=>e.tokens()))],o=parseMediaFeature(r,n,s);if(!1!==o)return new MediaInParens(o);const u=parseMediaCondition(r.value);return!1!==u?new MediaInParens(u,n,s):new MediaInParens(new GeneralEnclosed(r),e.slice(0,a).flatMap((e=>e.tokens())),e.slice(a+1).flatMap((e=>e.tokens())))}function parseMediaInParensFromSimpleBlock(e){if(e.startToken[0]!==i.TokenType.OpenParen)return!1;const t=parseMediaFeature(e,[e.startToken],[e.endToken]);if(!1!==t)return new MediaInParens(t);const a=parseMediaCondition(e.value);return!1!==a?new MediaInParens(a,[e.startToken],[e.endToken]):new MediaInParens(new GeneralEnclosed(e))}function parseMediaNot(e){let i=!1,a=null;for(let r=0;r<e.length;r++){const n=e[r];if(n.type!==t.ComponentValueType.Whitespace&&n.type!==t.ComponentValueType.Comment){if(isIdent(n)){if("not"===toLowerCaseAZ(n.value[4].value)){if(i)return!1;i=!0;continue}return!1}if(!i||!t.isSimpleBlockNode(n))return!1;{n.normalize();const t=parseMediaInParensFromSimpleBlock(n);if(!1===t)return!1;a=new MediaNot(e.slice(0,r).flatMap((e=>e.tokens())),t)}}}return a||!1}function parseMediaOr(e){let i=!1;for(let a=0;a<e.length;a++){const r=e[a];if(r.type!==t.ComponentValueType.Whitespace&&r.type!==t.ComponentValueType.Comment){if(isIdent(r)){if("or"===toLowerCaseAZ(r.value[4].value)){if(i)return!1;i=!0;continue}return!1}if(i&&t.isSimpleBlockNode(r)){r.normalize();const t=parseMediaInParensFromSimpleBlock(r);return!1!==t&&{advance:a,node:new MediaOr(e.slice(0,a).flatMap((e=>e.tokens())),t)}}return!1}}return!1}function parseMediaAnd(e){let i=!1;for(let a=0;a<e.length;a++){const r=e[a];if(r.type!==t.ComponentValueType.Whitespace&&r.type!==t.ComponentValueType.Comment){if(isIdent(r)){if("and"===toLowerCaseAZ(r.value[4].value)){if(i)return!1;i=!0;continue}return!1}if(i&&t.isSimpleBlockNode(r)){r.normalize();const t=parseMediaInParensFromSimpleBlock(r);return!1!==t&&{advance:a,node:new MediaAnd(e.slice(0,a).flatMap((e=>e.tokens())),t)}}return!1}}return!1}function parseFromTokens(e,i){const a=t.parseCommaSeparatedListOfComponentValues(e,{onParseError:i?.onParseError});return a.map(((e,t)=>{const r=parseMediaQuery(e);return 0==r&&!0===i?.preserveInvalidMediaQueries?new MediaQueryInvalid(a[t]):r})).filter((e=>!!e))}exports.MediaQueryModifier=void 0,(o=exports.MediaQueryModifier||(exports.MediaQueryModifier={})).Not="not",o.Only="only";class CustomMedia{type=exports.NodeType.CustomMedia;name;mediaQueryList=null;trueOrFalseKeyword=null;constructor(e,t,i){this.name=e,this.mediaQueryList=t,this.trueOrFalseKeyword=i??null}getName(){for(let e=0;e<this.name.length;e++){const t=this.name[e];if(t[0]===i.TokenType.Ident)return t[4].value}return""}getNameToken(){for(let e=0;e<this.name.length;e++){const t=this.name[e];if(t[0]===i.TokenType.Ident)return t}return null}hasMediaQueryList(){return!!this.mediaQueryList}hasTrueKeyword(){if(!this.trueOrFalseKeyword)return!1;for(let e=0;e<this.trueOrFalseKeyword.length;e++){const t=this.trueOrFalseKeyword[e];if(t[0]!==i.TokenType.Comment&&t[0]!==i.TokenType.Whitespace)return t[0]===i.TokenType.Ident&&"true"===toLowerCaseAZ(t[4].value)}return!1}hasFalseKeyword(){if(!this.trueOrFalseKeyword)return!1;for(let e=0;e<this.trueOrFalseKeyword.length;e++){const t=this.trueOrFalseKeyword[e];if(t[0]!==i.TokenType.Comment&&t[0]!==i.TokenType.Whitespace)return t[0]===i.TokenType.Ident&&"false"===toLowerCaseAZ(t[4].value)}return!1}tokens(){if(this.trueOrFalseKeyword)return[...this.name,...this.trueOrFalseKeyword];if(!this.mediaQueryList)return[...this.name];const e=[];for(let t=0;t<this.mediaQueryList.length;t++){const a=this.mediaQueryList[t];0!==t&&e.push([i.TokenType.Comma,",",-1,-1,void 0]),e.push(...a.tokens())}return[...this.name,...e]}toString(){return i.stringify(...this.tokens())}toJSON(){return{type:this.type,string:this.toString(),nameValue:this.getName(),name:this.name,hasFalseKeyword:this.hasFalseKeyword(),hasTrueKeyword:this.hasTrueKeyword(),trueOrFalseKeyword:this.trueOrFalseKeyword,mediaQueryList:this.mediaQueryList?.map((e=>e.toJSON()))}}isCustomMedia(){return CustomMedia.isCustomMedia(this)}static isCustomMedia(e){return!!e&&(e instanceof CustomMedia&&e.type===exports.NodeType.CustomMedia)}}function parseCustomMediaFromTokens(e,t){let a=[],r=e;for(let t=0;t<e.length;t++)if(e[t][0]!==i.TokenType.Comment&&e[t][0]!==i.TokenType.Whitespace){if(e[t][0]===i.TokenType.Ident){if(e[t][4].value.startsWith("--")){a=e.slice(0,t+1),r=e.slice(t+1);break}}return!1}let n=!0;for(let e=0;e<r.length;e++)if(r[e][0]!==i.TokenType.Comment&&r[e][0]!==i.TokenType.Whitespace){if(r[e][0]===i.TokenType.Ident){const t=toLowerCaseAZ(r[e][4].value);if("false"===t)continue;if("true"===t)continue}if(r[e][0]===i.TokenType.EOF)break;n=!1}return n?new CustomMedia(a,null,r):new CustomMedia(a,parseFromTokens(i.cloneTokens(r),t))}function isMediaConditionListWithAnd(e){return MediaConditionListWithAnd.isMediaConditionListWithAnd(e)}function isMediaConditionListWithOr(e){return MediaConditionListWithOr.isMediaConditionListWithOr(e)}function isMediaFeatureRangeNameValue(e){return MediaFeatureRangeNameValue.isMediaFeatureRangeNameValue(e)}function isMediaFeatureRangeValueName(e){return MediaFeatureRangeValueName.isMediaFeatureRangeValueName(e)}function isMediaFeatureRangeValueNameValue(e){return MediaFeatureRangeValueNameValue.isMediaFeatureRangeValueNameValue(e)}function isMediaQueryWithType(e){return MediaQueryWithType.isMediaQueryWithType(e)}function isMediaQueryWithoutType(e){return MediaQueryWithoutType.isMediaQueryWithoutType(e)}function isMediaQueryInvalid(e){return MediaQueryInvalid.isMediaQueryInvalid(e)}exports.MediaType=void 0,(u=exports.MediaType||(exports.MediaType={})).All="all",u.Print="print",u.Screen="screen",u.Tty="tty",u.Tv="tv",u.Projection="projection",u.Handheld="handheld",u.Braille="braille",u.Embossed="embossed",u.Aural="aural",u.Speech="speech",exports.CustomMedia=CustomMedia,exports.GeneralEnclosed=GeneralEnclosed,exports.MediaAnd=MediaAnd,exports.MediaCondition=MediaCondition,exports.MediaConditionListWithAnd=MediaConditionListWithAnd,exports.MediaConditionListWithOr=MediaConditionListWithOr,exports.MediaFeature=MediaFeature,exports.MediaFeatureBoolean=MediaFeatureBoolean,exports.MediaFeatureName=MediaFeatureName,exports.MediaFeaturePlain=MediaFeaturePlain,exports.MediaFeatureRangeNameValue=MediaFeatureRangeNameValue,exports.MediaFeatureRangeValueName=MediaFeatureRangeValueName,exports.MediaFeatureRangeValueNameValue=MediaFeatureRangeValueNameValue,exports.MediaFeatureValue=MediaFeatureValue,exports.MediaInParens=MediaInParens,exports.MediaNot=MediaNot,exports.MediaOr=MediaOr,exports.MediaQueryInvalid=MediaQueryInvalid,exports.MediaQueryWithType=MediaQueryWithType,exports.MediaQueryWithoutType=MediaQueryWithoutType,exports.cloneMediaQuery=function cloneMediaQuery(e){const t=i.cloneTokens(e.tokens()),a=parseFromTokens(t,{preserveInvalidMediaQueries:!0})[0];if(!a)throw new Error(`Failed to clone media query for : "${i.stringify(...t)}"`);if(isMediaQueryInvalid(e)&&isMediaQueryInvalid(a))return a;if(isMediaQueryWithType(e)&&isMediaQueryWithType(a))return a;if(isMediaQueryWithoutType(e)&&isMediaQueryWithoutType(a))return a;throw new Error(`Failed to clone media query for : "${i.stringify(...t)}"`)},exports.comparisonFromTokens=comparisonFromTokens,exports.invertComparison=function invertComparison(e){switch(e){case exports.MediaFeatureEQ.EQ:return exports.MediaFeatureEQ.EQ;case exports.MediaFeatureLT.LT:return exports.MediaFeatureGT.GT;case exports.MediaFeatureLT.LT_OR_EQ:return exports.MediaFeatureGT.GT_OR_EQ;case exports.MediaFeatureGT.GT:return exports.MediaFeatureLT.LT;case exports.MediaFeatureGT.GT_OR_EQ:return exports.MediaFeatureLT.LT_OR_EQ;default:return!1}},exports.isCustomMedia=function isCustomMedia(e){return CustomMedia.isCustomMedia(e)},exports.isGeneralEnclosed=function isGeneralEnclosed(e){return GeneralEnclosed.isGeneralEnclosed(e)},exports.isMediaAnd=function isMediaAnd(e){return MediaAnd.isMediaAnd(e)},exports.isMediaCondition=function isMediaCondition(e){return MediaCondition.isMediaCondition(e)},exports.isMediaConditionList=function isMediaConditionList(e){return isMediaConditionListWithAnd(e)||isMediaConditionListWithOr(e)},exports.isMediaConditionListWithAnd=isMediaConditionListWithAnd,exports.isMediaConditionListWithOr=isMediaConditionListWithOr,exports.isMediaFeature=function isMediaFeature(e){return MediaFeature.isMediaFeature(e)},exports.isMediaFeatureBoolean=function isMediaFeatureBoolean(e){return MediaFeatureBoolean.isMediaFeatureBoolean(e)},exports.isMediaFeatureName=function isMediaFeatureName(e){return MediaFeatureName.isMediaFeatureName(e)},exports.isMediaFeaturePlain=function isMediaFeaturePlain(e){return MediaFeaturePlain.isMediaFeaturePlain(e)},exports.isMediaFeatureRange=function isMediaFeatureRange(e){return isMediaFeatureRangeNameValue(e)||isMediaFeatureRangeValueName(e)||isMediaFeatureRangeValueNameValue(e)},exports.isMediaFeatureRangeNameValue=isMediaFeatureRangeNameValue,exports.isMediaFeatureRangeValueName=isMediaFeatureRangeValueName,exports.isMediaFeatureRangeValueNameValue=isMediaFeatureRangeValueNameValue,exports.isMediaFeatureValue=function isMediaFeatureValue(e){return MediaFeatureValue.isMediaFeatureValue(e)},exports.isMediaInParens=function isMediaInParens(e){return MediaInParens.isMediaInParens(e)},exports.isMediaNot=function isMediaNot(e){return MediaNot.isMediaNot(e)},exports.isMediaOr=function isMediaOr(e){return MediaOr.isMediaOr(e)},exports.isMediaQuery=function isMediaQuery(e){return isMediaQueryWithType(e)||isMediaQueryWithoutType(e)||isMediaQueryInvalid(e)},exports.isMediaQueryInvalid=isMediaQueryInvalid,exports.isMediaQueryWithType=isMediaQueryWithType,exports.isMediaQueryWithoutType=isMediaQueryWithoutType,exports.matchesComparison=matchesComparison,exports.matchesRatio=matchesRatio,exports.matchesRatioExactly=matchesRatioExactly,exports.modifierFromToken=modifierFromToken,exports.newMediaFeatureBoolean=function newMediaFeatureBoolean(e){const a=[i.TokenType.Ident,"",-1,-1,{value:""}];return i.mutateIdent(a,e),new MediaFeature(new MediaFeatureBoolean(new MediaFeatureName(new t.TokenNode(a))),[[i.TokenType.OpenParen,"(",-1,-1,void 0]],[[i.TokenType.CloseParen,")",-1,-1,void 0]])},exports.newMediaFeaturePlain=function newMediaFeaturePlain(e,...a){const r=[i.TokenType.Ident,"",-1,-1,{value:""}];i.mutateIdent(r,e);const n=t.parseListOfComponentValues(a);return new MediaFeature(new MediaFeaturePlain(new MediaFeatureName(new t.TokenNode(r)),[i.TokenType.Colon,":",-1,-1,void 0],new MediaFeatureValue(1===n.length?n[0]:n)),[[i.TokenType.OpenParen,"(",-1,-1,void 0]],[[i.TokenType.CloseParen,")",-1,-1,void 0]])},exports.parse=function parse(e,t){const a=i.tokenizer({css:e},{onParseError:t?.onParseError}),r=[];for(;!a.endOfFile();)r.push(a.nextToken());return r.push(a.nextToken()),parseFromTokens(r,t)},exports.parseCustomMedia=function parseCustomMedia(e,t){const a=i.tokenizer({css:e},{onParseError:t?.onParseError}),r=[];for(;!a.endOfFile();)r.push(a.nextToken());return r.push(a.nextToken()),parseCustomMediaFromTokens(r,t)},exports.parseCustomMediaFromTokens=parseCustomMediaFromTokens,exports.parseFromTokens=parseFromTokens,exports.typeFromToken=function typeFromToken(e){if(e[0]!==i.TokenType.Ident)return!1;switch(toLowerCaseAZ(e[4].value)){case exports.MediaType.All:return exports.MediaType.All;case exports.MediaType.Print:return exports.MediaType.Print;case exports.MediaType.Screen:return exports.MediaType.Screen;case exports.MediaType.Tty:return exports.MediaType.Tty;case exports.MediaType.Tv:return exports.MediaType.Tv;case exports.MediaType.Projection:return exports.MediaType.Projection;case exports.MediaType.Handheld:return exports.MediaType.Handheld;case exports.MediaType.Braille:return exports.MediaType.Braille;case exports.MediaType.Embossed:return exports.MediaType.Embossed;case exports.MediaType.Aural:return exports.MediaType.Aural;case exports.MediaType.Speech:return exports.MediaType.Speech;default:return!1}};

},{"@csstools/css-parser-algorithms":2,"@csstools/css-tokenizer":3}],5:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],6:[function(require,module,exports){

},{}],7:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)
},{"base64-js":5,"buffer":7,"ieee754":8}],8:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],9:[function(require,module,exports){
let urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
let customAlphabet = (alphabet, defaultSize = 21) => {
  return (size = defaultSize) => {
    let id = ''
    let i = size
    while (i--) {
      id += alphabet[(Math.random() * alphabet.length) | 0]
    }
    return id
  }
}
let nanoid = (size = 21) => {
  let id = ''
  let i = size
  while (i--) {
    id += urlAlphabet[(Math.random() * 64) | 0]
  }
  return id
}
module.exports = { nanoid, customAlphabet }

},{}],10:[function(require,module,exports){
var x=String;
var create=function() {return {isColorSupported:false,reset:x,bold:x,dim:x,italic:x,underline:x,inverse:x,hidden:x,strikethrough:x,black:x,red:x,green:x,yellow:x,blue:x,magenta:x,cyan:x,white:x,gray:x,bgBlack:x,bgRed:x,bgGreen:x,bgYellow:x,bgBlue:x,bgMagenta:x,bgCyan:x,bgWhite:x}};
module.exports=create();
module.exports.createColors = create;

},{}],11:[function(require,module,exports){
"use strict";var e=require("@csstools/cascade-layer-name-parser"),r=require("@csstools/css-tokenizer"),t=require("@csstools/media-query-list-parser");const n=e.parse("csstools-implicit-layer")[0];function collectCascadeLayerOrder(r){const t=new Map,o=new Map,a=[];r.walkAtRules((r=>{var s;if("layer"!==r.name.toLowerCase())return;{let e=r.parent;for(;e;){if("atrule"!==e.type||"layer"!==e.name.toLowerCase()){if(e===r.root())break;return}e=e.parent}}let i;if(r.nodes)i=normalizeLayerName(r.params,1);else{if(!r.params.trim())return;i=r.params}let l=e.parse(i);if(null!=(s=l)&&s.length){{let e=r.parent;for(;e&&"atrule"===e.type&&"layer"===e.name.toLowerCase();){const r=o.get(e);r?(l=l.map((e=>r.concat(e))),e=e.parent):e=e.parent}}if(e.addLayerToModel(a,l),r.nodes){const e=l[0].concat(n);t.set(r,e),o.set(r,l[0])}}}));for(const r of t.values())e.addLayerToModel(a,[r]);const s=new WeakMap;for(const[e,r]of t)s.set(e,a.findIndex((e=>r.equal(e))));return s}function normalizeLayerName(e,r){return e.trim()?e:"csstools-anon-layer--"+r++}const o=new Set(["scope","container","layer"]);function isProcessableCustomMediaRule(e){if("custom-media"!==e.name.toLowerCase())return!1;if(!e.params||!e.params.includes("--"))return!1;if(e.nodes&&e.nodes.length>0)return!1;let r=e.parent;for(;r;){if("atrule"===r.type&&!o.has(r.name.toLowerCase()))return!1;r=r.parent}return!0}function removeCyclicReferences(e,r){const t=new Set;let n=r;for(;e.size>0;)try{toposort(Array.from(e.keys()),n);break}catch(r){if(!r._graphNode)throw r;e.delete(r._graphNode),t.add(r._graphNode),n=n.filter((e=>-1===e.indexOf(r._graphNode)))}return t}function toposort(e,r){let t=e.length;const n=new Array(t),o={};let a=t;const s=makeOutgoingEdges(r),i=makeNodesHash(e);for(;a--;)o[a]||visit(e[a],a,new Set);return n;function visit(e,r,a){if(a.has(e)){const r=new Error("Cyclic dependency"+JSON.stringify(e));throw r._graphNode=e,r}if(!i.has(e))return;if(o[r])return;o[r]=!0;let l=s.get(e)||new Set;if(l=Array.from(l),r=l.length){a.add(e);do{const e=l[--r];visit(e,i.get(e),a)}while(r);a.delete(e)}n[--t]=e}}function makeOutgoingEdges(e){const r=new Map;for(let t=0,n=e.length;t<n;t++){const n=e[t];r.has(n[0])||r.set(n[0],new Set),r.has(n[1])||r.set(n[1],new Set),r.get(n[0]).add(n[1])}return r}function makeNodesHash(e){const r=new Map;for(let t=0,n=e.length;t<n;t++)r.set(e[t],t);return r}function atMediaParamsTokens(e){const t=r.tokenizer({css:e},{onParseError:()=>{throw new Error(`Unable to parse media query "${e}"`)}}),n=[];for(;!t.endOfFile();)n.push(t.nextToken());return n}const a=[[r.TokenType.Ident,"max-color",0,0,{value:"max-color"}],[r.TokenType.Colon,":",0,0,void 0],[r.TokenType.Number,"2147477350",0,0,{value:2147477350,type:r.NumberType.Integer}]],s=[[r.TokenType.Ident,"color",0,0,{value:"color"}],[r.TokenType.Colon,":",0,0,void 0],[r.TokenType.Number,"2147477350",0,0,{value:2147477350,type:r.NumberType.Integer}]];function replaceTrueAndFalseTokens(e){let t,n=[];for(let o=0;o<e.length;o++)if(e[o][0]!==r.TokenType.Comment&&e[o][0]!==r.TokenType.Whitespace){if(e[o][0]===r.TokenType.Ident){const r=e[o];if("true"===r[4].value.toLowerCase()){t="true",n=e.slice(o+1);break}if("false"===r[4].value.toLowerCase()){t="false",n=e.slice(o+1);break}}return e}if(!t)return e;for(let t=0;t<n.length;t++)if(n[t][0]!==r.TokenType.Comment&&n[t][0]!==r.TokenType.Whitespace)return e;return"true"===t?[[r.TokenType.Whitespace," ",0,0,void 0],[r.TokenType.OpenParen,"(",0,0,void 0],...a,[r.TokenType.CloseParen,")",0,0,void 0]]:[[r.TokenType.Whitespace," ",0,0,void 0],[r.TokenType.OpenParen,"(",0,0,void 0],...s,[r.TokenType.CloseParen,")",0,0,void 0]]}function parseCustomMedia(e){const n=atMediaParamsTokens(e),o=new Set;let a="",s=n;for(let e=0;e<n.length;e++)if(n[e][0]!==r.TokenType.Comment&&n[e][0]!==r.TokenType.Whitespace){if(n[e][0]===r.TokenType.Ident){const r=n[e];if(r[4].value.startsWith("--")){a=r[4].value,s=n.slice(e+1);break}}return!1}for(let e=0;e<s.length;e++)if(s[e][0]===r.TokenType.Ident){const r=s[e];r[4].value.startsWith("--")&&o.add(r[4].value)}s=replaceTrueAndFalseTokens(s);const i=t.parseFromTokens(r.cloneTokens(s),{preserveInvalidMediaQueries:!0,onParseError:()=>{throw new Error(`Unable to parse media query "${r.stringify(...s)}"`)}}),l=t.parseFromTokens(r.cloneTokens(s),{preserveInvalidMediaQueries:!0,onParseError:()=>{throw new Error(`Unable to parse media query "${r.stringify(...s)}"`)}});for(let e=0;e<l.length;e++)l[e]=l[e].negateQuery();return{name:a,truthy:i,falsy:l,dependsOn:Array.from(o).map((e=>[e,a]))}}function getCustomMedia(e,r,t){const n=new Map,o=new Map,a=[],s=collectCascadeLayerOrder(e);e.walkAtRules((e=>{if(!isProcessableCustomMediaRule(e))return;const r=parseCustomMedia(e.params);if(!r)return;if(0===r.truthy.length)return;const i=(u=s,(l=e).parent&&"atrule"===l.parent.type&&"layer"===l.parent.name.toLowerCase()?u.has(l.parent)?u.get(l.parent)+1:0:1e7);var l,u;const c=o.get(r.name)??-1;if(i&&i>=c&&(o.set(r.name,i),n.set(r.name,{truthy:r.truthy,falsy:r.falsy}),a.push(...r.dependsOn)),!t.preserve){const r=e.parent;e.remove(),removeEmptyAncestorBlocks(r)}}));const i=removeCyclicReferences(n,a);for(const t of i.values())e.warn(r,`@custom-media rules have cyclic dependencies for "${t}"`);return n}function removeEmptyAncestorBlocks(e){if(!e)return;let r=e;for(;r;){if(r.nodes&&r.nodes.length>0)return;const e=r.parent;r.remove(),r=e}}function transformAtMediaListTokens(e,r){const n=t.parse(e,{preserveInvalidMediaQueries:!0,onParseError:()=>{throw new Error(`Unable to parse media query "${e}"`)}}),o=n.map((e=>e.toString()));for(let e=0;e<n.length;e++){const t=n[e],a=o[e];{const n=transformSimpleMediaQuery(t,r);if(n&&n.replaceWith!==a)return o.map(((r,t)=>t===e?n:{replaceWith:r}))}const s=transformComplexMediaQuery(t,r);if(s&&0!==s.length&&s[0].replaceWith!==a)return o.flatMap(((r,t)=>t===e?s:[{replaceWith:r}]))}return[]}function transformSimpleMediaQuery(e,r){if(!mediaQueryIsSimple(e))return null;let n=null;return e.walk((e=>{const o=e.node;if(!t.isMediaFeatureBoolean(o))return;const a=o.getName();if(!a.startsWith("--"))return!1;const s=r.get(a);return s?(n={replaceWith:s.truthy.map((e=>e.toString().trim())).join(",")},!1):void 0})),n}function transformComplexMediaQuery(e,r){let n=[];return e.walk((o=>{const i=o.node;if(!t.isMediaFeatureBoolean(i))return;const l=o.parent;if(!t.isMediaFeature(l))return;const u=i.getName();if(!u.startsWith("--"))return!1;const c=r.get(u);if(c){if(1===c.truthy.length&&mediaQueryIsSimple(c.truthy[0])){let r=null;if(c.truthy[0].walk((e=>{if(t.isMediaFeature(e.node))return r=e.node,!1})),r&&r.feature)return l.feature=r.feature,n=[{replaceWith:e.toString()}],!1}const r=t.newMediaFeaturePlain(a[0][4].value,a[2]);l.feature=r.feature;const o=e.toString(),i=t.newMediaFeaturePlain(s[0][4].value,s[2]);l.feature=i.feature;const u=e.toString();return n=[{replaceWith:o,encapsulateWith:c.truthy.map((e=>e.toString().trim())).join(",")},{replaceWith:u,encapsulateWith:c.falsy.map((e=>e.toString().trim())).join(",")}],!1}})),n}function mediaQueryIsSimple(e){if(t.isMediaQueryInvalid(e))return!1;if(t.isMediaQueryWithType(e))return!1;let r=!0;return e.walk((e=>{if(t.isMediaAnd(e.node)||t.isMediaOr(e.node)||t.isMediaNot(e.node)||t.isMediaConditionList(e.node)||t.isGeneralEnclosed(e.node))return r=!1,!1})),r}const creator=e=>{const r=Boolean(Object(e).preserve);if("importFrom"in Object(e))throw new Error('[postcss-custom-media] "importFrom" is no longer supported');if("exportTo"in Object(e))throw new Error('[postcss-custom-media] "exportTo" is no longer supported');return{postcssPlugin:"postcss-custom-media",prepare(){const e=new WeakSet;let t=new Map;return{Once:(e,{result:n})=>{t=getCustomMedia(e,n,{preserve:r})},AtRule:(n,{result:o})=>{if(e.has(n))return;if("media"!==n.name.toLowerCase())return;if(!n.params)return;if(!n.params.includes("--"))return;let a=[];try{a=transformAtMediaListTokens(n.params,t)}catch(e){return void n.warn(o,`Failed to parse @custom-media params with error message: "${e.message}"`)}if(!a||0===a.length)return;if(1===a.length){if(n.params.trim()===a[0].replaceWith.trim())return;return e.add(n),n.cloneBefore({params:a[0].replaceWith.trim()}),r?void 0:void n.remove()}if(!!!a.find((e=>!!e.encapsulateWith)))return e.add(n),n.cloneBefore({params:a.map((e=>e.replaceWith)).join(",").trim()}),void(r||n.remove());a.forEach((r=>{if(!r.encapsulateWith)return void n.cloneBefore({params:r.replaceWith.trim()});const t=n.clone({params:r.replaceWith}),o=n.clone({params:r.encapsulateWith.trim(),nodes:[]});t.parent=void 0,o.parent=void 0,e.add(n),o.append(t),n.before(o)})),r||n.remove()}}}}};creator.postcss=!0,module.exports=creator;

},{"@csstools/cascade-layer-name-parser":1,"@csstools/css-tokenizer":3,"@csstools/media-query-list-parser":4}],12:[function(require,module,exports){
const feature_unit = {
  'width': 'px',
  'height': 'px',
  'device-width': 'px',
  'device-height': 'px',
  'aspect-ratio': '',
  'device-aspect-ratio': '',
  'color': '',
  'color-index': '',
  'monochrome': '',
  'resolution': 'dpi'
};

// Supported min-/max- attributes
const feature_name = Object.keys(feature_unit);

const step = .001; // smallest even number that won’t break complex queries (1in = 96px)

const power = {
  '>': 1,
  '<': -1
};

const minmax = {
  '>': 'min',
  '<': 'max'
};

function create_query(name, gtlt, eq, value) {
  return value.replace(/([-\d\.]+)(.*)/, function (_match, number, unit) {
    const initialNumber = parseFloat(number);

    if (parseFloat(number) || eq) {
      // if eq is true, then number remains same
      if (!eq) {
        // change integer pixels value only on integer pixel
        if (unit === 'px' && initialNumber === parseInt(number, 10)) {
          number = initialNumber + power[gtlt];
        } else {
          number = Number(Math.round(parseFloat(number) + step * power[gtlt] + 'e6')+'e-6');
        }
      }
    } else {
      number = power[gtlt] + feature_unit[name];
    }

    return '(' + minmax[gtlt] + '-' + name + ': ' + number + unit + ')';
  });
}

function transform(rule) {
  /**
   * 转换 <mf-name> <|>= <mf-value>
   *    $1  $2   $3
   * (width >= 300px) => (min-width: 300px)
   * (width <= 900px) => (max-width: 900px)
   */

  if (!rule.params.includes('<') && !rule.params.includes('>')) {
    return
  }

  // The value doesn't support negative values
  // But -0 is always equivalent to 0 in CSS, and so is also accepted as a valid <mq-boolean> value.

  rule.params = rule.params.replace(/\(\s*([a-z-]+?)\s*([<>])(=?)\s*((?:-?\d*\.?(?:\s*\/?\s*)?\d+[a-z]*)?)\s*\)/gi, function($0, $1, $2, $3, $4) {
    if (feature_name.indexOf($1) > -1) {
      return create_query($1, $2, $3, $4);
    }
    // If it is not the specified attribute, don't replace
    return $0;
  })

  /**
   * 转换  <mf-value> <|<= <mf-name> <|<= <mf-value>
   * 转换  <mf-value> >|>= <mf-name> >|>= <mf-value>
   *   $1  $2$3 $4  $5$6  $7
   * (500px <= width <= 1200px) => (min-width: 500px) and (max-width: 1200px)
   * (500px < width <= 1200px) => (min-width: 501px) and (max-width: 1200px)
   * (900px >= width >= 300px)  => (min-width: 300px) and (max-width: 900px)
   */

  rule.params = rule.params.replace(/\(\s*((?:-?\d*\.?(?:\s*\/?\s*)?\d+[a-z]*)?)\s*(<|>)(=?)\s*([a-z-]+)\s*(<|>)(=?)\s*((?:-?\d*\.?(?:\s*\/?\s*)?\d+[a-z]*)?)\s*\)/gi, function($0, $1, $2, $3, $4, $5, $6, $7) {

    if (feature_name.indexOf($4) > -1) {
      if ($2 === '<' && $5 === '<' || $2 === '>' && $5 === '>') {
        const min = ($2 === '<') ? $1 : $7;
        const max = ($2 === '<') ? $7 : $1;

        // output differently depended on expression direction
        // <mf-value> <|<= <mf-name> <|<= <mf-value>
        // or
        // <mf-value> >|>= <mf-name> >|>= <mf-value>
        let equals_for_min = $3;
        let equals_for_max = $6;

        if ($2 === '>') {
          equals_for_min = $6;
          equals_for_max = $3;
        }

        return create_query($4, '>', equals_for_min, min) + ' and ' + create_query($4, '<', equals_for_max, max);
      }
    }
    // If it is not the specified attribute, don't replace
    return $0;
  });
}

module.exports = () => ({
  postcssPlugin: 'postcss-media-minmax',
  AtRule: {
    media: (atRule) => {
      transform(atRule);
    },
    'custom-media': (atRule) => {
      transform(atRule);
    },
  },
});

module.exports.postcss = true

},{}],13:[function(require,module,exports){
'use strict'

let Container = require('./container')

class AtRule extends Container {
  constructor(defaults) {
    super(defaults)
    this.type = 'atrule'
  }

  append(...children) {
    if (!this.proxyOf.nodes) this.nodes = []
    return super.append(...children)
  }

  prepend(...children) {
    if (!this.proxyOf.nodes) this.nodes = []
    return super.prepend(...children)
  }
}

module.exports = AtRule
AtRule.default = AtRule

Container.registerAtRule(AtRule)

},{"./container":15}],14:[function(require,module,exports){
'use strict'

let Node = require('./node')

class Comment extends Node {
  constructor(defaults) {
    super(defaults)
    this.type = 'comment'
  }
}

module.exports = Comment
Comment.default = Comment

},{"./node":25}],15:[function(require,module,exports){
'use strict'

let { isClean, my } = require('./symbols')
let Declaration = require('./declaration')
let Comment = require('./comment')
let Node = require('./node')

let parse, Rule, AtRule, Root

function cleanSource(nodes) {
  return nodes.map(i => {
    if (i.nodes) i.nodes = cleanSource(i.nodes)
    delete i.source
    return i
  })
}

function markDirtyUp(node) {
  node[isClean] = false
  if (node.proxyOf.nodes) {
    for (let i of node.proxyOf.nodes) {
      markDirtyUp(i)
    }
  }
}

class Container extends Node {
  append(...children) {
    for (let child of children) {
      let nodes = this.normalize(child, this.last)
      for (let node of nodes) this.proxyOf.nodes.push(node)
    }

    this.markDirty()

    return this
  }

  cleanRaws(keepBetween) {
    super.cleanRaws(keepBetween)
    if (this.nodes) {
      for (let node of this.nodes) node.cleanRaws(keepBetween)
    }
  }

  each(callback) {
    if (!this.proxyOf.nodes) return undefined
    let iterator = this.getIterator()

    let index, result
    while (this.indexes[iterator] < this.proxyOf.nodes.length) {
      index = this.indexes[iterator]
      result = callback(this.proxyOf.nodes[index], index)
      if (result === false) break

      this.indexes[iterator] += 1
    }

    delete this.indexes[iterator]
    return result
  }

  every(condition) {
    return this.nodes.every(condition)
  }

  getIterator() {
    if (!this.lastEach) this.lastEach = 0
    if (!this.indexes) this.indexes = {}

    this.lastEach += 1
    let iterator = this.lastEach
    this.indexes[iterator] = 0

    return iterator
  }

  getProxyProcessor() {
    return {
      get(node, prop) {
        if (prop === 'proxyOf') {
          return node
        } else if (!node[prop]) {
          return node[prop]
        } else if (
          prop === 'each' ||
          (typeof prop === 'string' && prop.startsWith('walk'))
        ) {
          return (...args) => {
            return node[prop](
              ...args.map(i => {
                if (typeof i === 'function') {
                  return (child, index) => i(child.toProxy(), index)
                } else {
                  return i
                }
              })
            )
          }
        } else if (prop === 'every' || prop === 'some') {
          return cb => {
            return node[prop]((child, ...other) =>
              cb(child.toProxy(), ...other)
            )
          }
        } else if (prop === 'root') {
          return () => node.root().toProxy()
        } else if (prop === 'nodes') {
          return node.nodes.map(i => i.toProxy())
        } else if (prop === 'first' || prop === 'last') {
          return node[prop].toProxy()
        } else {
          return node[prop]
        }
      },

      set(node, prop, value) {
        if (node[prop] === value) return true
        node[prop] = value
        if (prop === 'name' || prop === 'params' || prop === 'selector') {
          node.markDirty()
        }
        return true
      }
    }
  }

  index(child) {
    if (typeof child === 'number') return child
    if (child.proxyOf) child = child.proxyOf
    return this.proxyOf.nodes.indexOf(child)
  }

  insertAfter(exist, add) {
    let existIndex = this.index(exist)
    let nodes = this.normalize(add, this.proxyOf.nodes[existIndex]).reverse()
    existIndex = this.index(exist)
    for (let node of nodes) this.proxyOf.nodes.splice(existIndex + 1, 0, node)

    let index
    for (let id in this.indexes) {
      index = this.indexes[id]
      if (existIndex < index) {
        this.indexes[id] = index + nodes.length
      }
    }

    this.markDirty()

    return this
  }

  insertBefore(exist, add) {
    let existIndex = this.index(exist)
    let type = existIndex === 0 ? 'prepend' : false
    let nodes = this.normalize(add, this.proxyOf.nodes[existIndex], type).reverse()
    existIndex = this.index(exist)
    for (let node of nodes) this.proxyOf.nodes.splice(existIndex, 0, node)

    let index
    for (let id in this.indexes) {
      index = this.indexes[id]
      if (existIndex <= index) {
        this.indexes[id] = index + nodes.length
      }
    }

    this.markDirty()

    return this
  }

  normalize(nodes, sample) {
    if (typeof nodes === 'string') {
      nodes = cleanSource(parse(nodes).nodes)
    } else if (Array.isArray(nodes)) {
      nodes = nodes.slice(0)
      for (let i of nodes) {
        if (i.parent) i.parent.removeChild(i, 'ignore')
      }
    } else if (nodes.type === 'root' && this.type !== 'document') {
      nodes = nodes.nodes.slice(0)
      for (let i of nodes) {
        if (i.parent) i.parent.removeChild(i, 'ignore')
      }
    } else if (nodes.type) {
      nodes = [nodes]
    } else if (nodes.prop) {
      if (typeof nodes.value === 'undefined') {
        throw new Error('Value field is missed in node creation')
      } else if (typeof nodes.value !== 'string') {
        nodes.value = String(nodes.value)
      }
      nodes = [new Declaration(nodes)]
    } else if (nodes.selector) {
      nodes = [new Rule(nodes)]
    } else if (nodes.name) {
      nodes = [new AtRule(nodes)]
    } else if (nodes.text) {
      nodes = [new Comment(nodes)]
    } else {
      throw new Error('Unknown node type in node creation')
    }

    let processed = nodes.map(i => {
      /* c8 ignore next */
      if (!i[my]) Container.rebuild(i)
      i = i.proxyOf
      if (i.parent) i.parent.removeChild(i)
      if (i[isClean]) markDirtyUp(i)
      if (typeof i.raws.before === 'undefined') {
        if (sample && typeof sample.raws.before !== 'undefined') {
          i.raws.before = sample.raws.before.replace(/\S/g, '')
        }
      }
      i.parent = this.proxyOf
      return i
    })

    return processed
  }

  prepend(...children) {
    children = children.reverse()
    for (let child of children) {
      let nodes = this.normalize(child, this.first, 'prepend').reverse()
      for (let node of nodes) this.proxyOf.nodes.unshift(node)
      for (let id in this.indexes) {
        this.indexes[id] = this.indexes[id] + nodes.length
      }
    }

    this.markDirty()

    return this
  }

  push(child) {
    child.parent = this
    this.proxyOf.nodes.push(child)
    return this
  }

  removeAll() {
    for (let node of this.proxyOf.nodes) node.parent = undefined
    this.proxyOf.nodes = []

    this.markDirty()

    return this
  }

  removeChild(child) {
    child = this.index(child)
    this.proxyOf.nodes[child].parent = undefined
    this.proxyOf.nodes.splice(child, 1)

    let index
    for (let id in this.indexes) {
      index = this.indexes[id]
      if (index >= child) {
        this.indexes[id] = index - 1
      }
    }

    this.markDirty()

    return this
  }

  replaceValues(pattern, opts, callback) {
    if (!callback) {
      callback = opts
      opts = {}
    }

    this.walkDecls(decl => {
      if (opts.props && !opts.props.includes(decl.prop)) return
      if (opts.fast && !decl.value.includes(opts.fast)) return

      decl.value = decl.value.replace(pattern, callback)
    })

    this.markDirty()

    return this
  }

  some(condition) {
    return this.nodes.some(condition)
  }

  walk(callback) {
    return this.each((child, i) => {
      let result
      try {
        result = callback(child, i)
      } catch (e) {
        throw child.addToError(e)
      }
      if (result !== false && child.walk) {
        result = child.walk(callback)
      }

      return result
    })
  }

  walkAtRules(name, callback) {
    if (!callback) {
      callback = name
      return this.walk((child, i) => {
        if (child.type === 'atrule') {
          return callback(child, i)
        }
      })
    }
    if (name instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === 'atrule' && name.test(child.name)) {
          return callback(child, i)
        }
      })
    }
    return this.walk((child, i) => {
      if (child.type === 'atrule' && child.name === name) {
        return callback(child, i)
      }
    })
  }

  walkComments(callback) {
    return this.walk((child, i) => {
      if (child.type === 'comment') {
        return callback(child, i)
      }
    })
  }

  walkDecls(prop, callback) {
    if (!callback) {
      callback = prop
      return this.walk((child, i) => {
        if (child.type === 'decl') {
          return callback(child, i)
        }
      })
    }
    if (prop instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === 'decl' && prop.test(child.prop)) {
          return callback(child, i)
        }
      })
    }
    return this.walk((child, i) => {
      if (child.type === 'decl' && child.prop === prop) {
        return callback(child, i)
      }
    })
  }

  walkRules(selector, callback) {
    if (!callback) {
      callback = selector

      return this.walk((child, i) => {
        if (child.type === 'rule') {
          return callback(child, i)
        }
      })
    }
    if (selector instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === 'rule' && selector.test(child.selector)) {
          return callback(child, i)
        }
      })
    }
    return this.walk((child, i) => {
      if (child.type === 'rule' && child.selector === selector) {
        return callback(child, i)
      }
    })
  }

  get first() {
    if (!this.proxyOf.nodes) return undefined
    return this.proxyOf.nodes[0]
  }

  get last() {
    if (!this.proxyOf.nodes) return undefined
    return this.proxyOf.nodes[this.proxyOf.nodes.length - 1]
  }
}

Container.registerParse = dependant => {
  parse = dependant
}

Container.registerRule = dependant => {
  Rule = dependant
}

Container.registerAtRule = dependant => {
  AtRule = dependant
}

Container.registerRoot = dependant => {
  Root = dependant
}

module.exports = Container
Container.default = Container

/* c8 ignore start */
Container.rebuild = node => {
  if (node.type === 'atrule') {
    Object.setPrototypeOf(node, AtRule.prototype)
  } else if (node.type === 'rule') {
    Object.setPrototypeOf(node, Rule.prototype)
  } else if (node.type === 'decl') {
    Object.setPrototypeOf(node, Declaration.prototype)
  } else if (node.type === 'comment') {
    Object.setPrototypeOf(node, Comment.prototype)
  } else if (node.type === 'root') {
    Object.setPrototypeOf(node, Root.prototype)
  }

  node[my] = true

  if (node.nodes) {
    node.nodes.forEach(child => {
      Container.rebuild(child)
    })
  }
}
/* c8 ignore stop */

},{"./comment":14,"./declaration":17,"./node":25,"./symbols":36}],16:[function(require,module,exports){
'use strict'

let pico = require('picocolors')

let terminalHighlight = require('./terminal-highlight')

class CssSyntaxError extends Error {
  constructor(message, line, column, source, file, plugin) {
    super(message)
    this.name = 'CssSyntaxError'
    this.reason = message

    if (file) {
      this.file = file
    }
    if (source) {
      this.source = source
    }
    if (plugin) {
      this.plugin = plugin
    }
    if (typeof line !== 'undefined' && typeof column !== 'undefined') {
      if (typeof line === 'number') {
        this.line = line
        this.column = column
      } else {
        this.line = line.line
        this.column = line.column
        this.endLine = column.line
        this.endColumn = column.column
      }
    }

    this.setMessage()

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CssSyntaxError)
    }
  }

  setMessage() {
    this.message = this.plugin ? this.plugin + ': ' : ''
    this.message += this.file ? this.file : '<css input>'
    if (typeof this.line !== 'undefined') {
      this.message += ':' + this.line + ':' + this.column
    }
    this.message += ': ' + this.reason
  }

  showSourceCode(color) {
    if (!this.source) return ''

    let css = this.source
    if (color == null) color = pico.isColorSupported
    if (terminalHighlight) {
      if (color) css = terminalHighlight(css)
    }

    let lines = css.split(/\r?\n/)
    let start = Math.max(this.line - 3, 0)
    let end = Math.min(this.line + 2, lines.length)

    let maxWidth = String(end).length

    let mark, aside
    if (color) {
      let { bold, gray, red } = pico.createColors(true)
      mark = text => bold(red(text))
      aside = text => gray(text)
    } else {
      mark = aside = str => str
    }

    return lines
      .slice(start, end)
      .map((line, index) => {
        let number = start + 1 + index
        let gutter = ' ' + (' ' + number).slice(-maxWidth) + ' | '
        if (number === this.line) {
          let spacing =
            aside(gutter.replace(/\d/g, ' ')) +
            line.slice(0, this.column - 1).replace(/[^\t]/g, ' ')
          return mark('>') + aside(gutter) + line + '\n ' + spacing + mark('^')
        }
        return ' ' + aside(gutter) + line
      })
      .join('\n')
  }

  toString() {
    let code = this.showSourceCode()
    if (code) {
      code = '\n\n' + code + '\n'
    }
    return this.name + ': ' + this.message + code
  }
}

module.exports = CssSyntaxError
CssSyntaxError.default = CssSyntaxError

},{"./terminal-highlight":6,"picocolors":10}],17:[function(require,module,exports){
'use strict'

let Node = require('./node')

class Declaration extends Node {
  constructor(defaults) {
    if (
      defaults &&
      typeof defaults.value !== 'undefined' &&
      typeof defaults.value !== 'string'
    ) {
      defaults = { ...defaults, value: String(defaults.value) }
    }
    super(defaults)
    this.type = 'decl'
  }

  get variable() {
    return this.prop.startsWith('--') || this.prop[0] === '$'
  }
}

module.exports = Declaration
Declaration.default = Declaration

},{"./node":25}],18:[function(require,module,exports){
'use strict'

let Container = require('./container')

let LazyResult, Processor

class Document extends Container {
  constructor(defaults) {
    // type needs to be passed to super, otherwise child roots won't be normalized correctly
    super({ type: 'document', ...defaults })

    if (!this.nodes) {
      this.nodes = []
    }
  }

  toResult(opts = {}) {
    let lazy = new LazyResult(new Processor(), this, opts)

    return lazy.stringify()
  }
}

Document.registerLazyResult = dependant => {
  LazyResult = dependant
}

Document.registerProcessor = dependant => {
  Processor = dependant
}

module.exports = Document
Document.default = Document

},{"./container":15}],19:[function(require,module,exports){
'use strict'

let Declaration = require('./declaration')
let PreviousMap = require('./previous-map')
let Comment = require('./comment')
let AtRule = require('./at-rule')
let Input = require('./input')
let Root = require('./root')
let Rule = require('./rule')

function fromJSON(json, inputs) {
  if (Array.isArray(json)) return json.map(n => fromJSON(n))

  let { inputs: ownInputs, ...defaults } = json
  if (ownInputs) {
    inputs = []
    for (let input of ownInputs) {
      let inputHydrated = { ...input, __proto__: Input.prototype }
      if (inputHydrated.map) {
        inputHydrated.map = {
          ...inputHydrated.map,
          __proto__: PreviousMap.prototype
        }
      }
      inputs.push(inputHydrated)
    }
  }
  if (defaults.nodes) {
    defaults.nodes = json.nodes.map(n => fromJSON(n, inputs))
  }
  if (defaults.source) {
    let { inputId, ...source } = defaults.source
    defaults.source = source
    if (inputId != null) {
      defaults.source.input = inputs[inputId]
    }
  }
  if (defaults.type === 'root') {
    return new Root(defaults)
  } else if (defaults.type === 'decl') {
    return new Declaration(defaults)
  } else if (defaults.type === 'rule') {
    return new Rule(defaults)
  } else if (defaults.type === 'comment') {
    return new Comment(defaults)
  } else if (defaults.type === 'atrule') {
    return new AtRule(defaults)
  } else {
    throw new Error('Unknown node type: ' + json.type)
  }
}

module.exports = fromJSON
fromJSON.default = fromJSON

},{"./at-rule":13,"./comment":14,"./declaration":17,"./input":20,"./previous-map":29,"./root":32,"./rule":33}],20:[function(require,module,exports){
'use strict'

let { SourceMapConsumer, SourceMapGenerator } = require('source-map-js')
let { fileURLToPath, pathToFileURL } = require('url')
let { isAbsolute, resolve } = require('path')
let { nanoid } = require('nanoid/non-secure')

let terminalHighlight = require('./terminal-highlight')
let CssSyntaxError = require('./css-syntax-error')
let PreviousMap = require('./previous-map')

let fromOffsetCache = Symbol('fromOffsetCache')

let sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator)
let pathAvailable = Boolean(resolve && isAbsolute)

class Input {
  constructor(css, opts = {}) {
    if (
      css === null ||
      typeof css === 'undefined' ||
      (typeof css === 'object' && !css.toString)
    ) {
      throw new Error(`PostCSS received ${css} instead of CSS string`)
    }

    this.css = css.toString()

    if (this.css[0] === '\uFEFF' || this.css[0] === '\uFFFE') {
      this.hasBOM = true
      this.css = this.css.slice(1)
    } else {
      this.hasBOM = false
    }

    if (opts.from) {
      if (
        !pathAvailable ||
        /^\w+:\/\//.test(opts.from) ||
        isAbsolute(opts.from)
      ) {
        this.file = opts.from
      } else {
        this.file = resolve(opts.from)
      }
    }

    if (pathAvailable && sourceMapAvailable) {
      let map = new PreviousMap(this.css, opts)
      if (map.text) {
        this.map = map
        let file = map.consumer().file
        if (!this.file && file) this.file = this.mapResolve(file)
      }
    }

    if (!this.file) {
      this.id = '<input css ' + nanoid(6) + '>'
    }
    if (this.map) this.map.file = this.from
  }

  error(message, line, column, opts = {}) {
    let result, endLine, endColumn

    if (line && typeof line === 'object') {
      let start = line
      let end = column
      if (typeof start.offset === 'number') {
        let pos = this.fromOffset(start.offset)
        line = pos.line
        column = pos.col
      } else {
        line = start.line
        column = start.column
      }
      if (typeof end.offset === 'number') {
        let pos = this.fromOffset(end.offset)
        endLine = pos.line
        endColumn = pos.col
      } else {
        endLine = end.line
        endColumn = end.column
      }
    } else if (!column) {
      let pos = this.fromOffset(line)
      line = pos.line
      column = pos.col
    }

    let origin = this.origin(line, column, endLine, endColumn)
    if (origin) {
      result = new CssSyntaxError(
        message,
        origin.endLine === undefined
          ? origin.line
          : { column: origin.column, line: origin.line },
        origin.endLine === undefined
          ? origin.column
          : { column: origin.endColumn, line: origin.endLine },
        origin.source,
        origin.file,
        opts.plugin
      )
    } else {
      result = new CssSyntaxError(
        message,
        endLine === undefined ? line : { column, line },
        endLine === undefined ? column : { column: endColumn, line: endLine },
        this.css,
        this.file,
        opts.plugin
      )
    }

    result.input = { column, endColumn, endLine, line, source: this.css }
    if (this.file) {
      if (pathToFileURL) {
        result.input.url = pathToFileURL(this.file).toString()
      }
      result.input.file = this.file
    }

    return result
  }

  fromOffset(offset) {
    let lastLine, lineToIndex
    if (!this[fromOffsetCache]) {
      let lines = this.css.split('\n')
      lineToIndex = new Array(lines.length)
      let prevIndex = 0

      for (let i = 0, l = lines.length; i < l; i++) {
        lineToIndex[i] = prevIndex
        prevIndex += lines[i].length + 1
      }

      this[fromOffsetCache] = lineToIndex
    } else {
      lineToIndex = this[fromOffsetCache]
    }
    lastLine = lineToIndex[lineToIndex.length - 1]

    let min = 0
    if (offset >= lastLine) {
      min = lineToIndex.length - 1
    } else {
      let max = lineToIndex.length - 2
      let mid
      while (min < max) {
        mid = min + ((max - min) >> 1)
        if (offset < lineToIndex[mid]) {
          max = mid - 1
        } else if (offset >= lineToIndex[mid + 1]) {
          min = mid + 1
        } else {
          min = mid
          break
        }
      }
    }
    return {
      col: offset - lineToIndex[min] + 1,
      line: min + 1
    }
  }

  mapResolve(file) {
    if (/^\w+:\/\//.test(file)) {
      return file
    }
    return resolve(this.map.consumer().sourceRoot || this.map.root || '.', file)
  }

  origin(line, column, endLine, endColumn) {
    if (!this.map) return false
    let consumer = this.map.consumer()

    let from = consumer.originalPositionFor({ column, line })
    if (!from.source) return false

    let to
    if (typeof endLine === 'number') {
      to = consumer.originalPositionFor({ column: endColumn, line: endLine })
    }

    let fromUrl

    if (isAbsolute(from.source)) {
      fromUrl = pathToFileURL(from.source)
    } else {
      fromUrl = new URL(
        from.source,
        this.map.consumer().sourceRoot || pathToFileURL(this.map.mapFile)
      )
    }

    let result = {
      column: from.column,
      endColumn: to && to.column,
      endLine: to && to.line,
      line: from.line,
      url: fromUrl.toString()
    }

    if (fromUrl.protocol === 'file:') {
      if (fileURLToPath) {
        result.file = fileURLToPath(fromUrl)
      } else {
        /* c8 ignore next 2 */
        throw new Error(`file: protocol is not available in this PostCSS build`)
      }
    }

    let source = consumer.sourceContentFor(from.source)
    if (source) result.source = source

    return result
  }

  toJSON() {
    let json = {}
    for (let name of ['hasBOM', 'css', 'file', 'id']) {
      if (this[name] != null) {
        json[name] = this[name]
      }
    }
    if (this.map) {
      json.map = { ...this.map }
      if (json.map.consumerCache) {
        json.map.consumerCache = undefined
      }
    }
    return json
  }

  get from() {
    return this.file || this.id
  }
}

module.exports = Input
Input.default = Input

if (terminalHighlight && terminalHighlight.registerInput) {
  terminalHighlight.registerInput(Input)
}

},{"./css-syntax-error":16,"./previous-map":29,"./terminal-highlight":6,"nanoid/non-secure":9,"path":6,"source-map-js":6,"url":6}],21:[function(require,module,exports){
(function (process){(function (){
'use strict'

let { isClean, my } = require('./symbols')
let MapGenerator = require('./map-generator')
let stringify = require('./stringify')
let Container = require('./container')
let Document = require('./document')
let warnOnce = require('./warn-once')
let Result = require('./result')
let parse = require('./parse')
let Root = require('./root')

const TYPE_TO_CLASS_NAME = {
  atrule: 'AtRule',
  comment: 'Comment',
  decl: 'Declaration',
  document: 'Document',
  root: 'Root',
  rule: 'Rule'
}

const PLUGIN_PROPS = {
  AtRule: true,
  AtRuleExit: true,
  Comment: true,
  CommentExit: true,
  Declaration: true,
  DeclarationExit: true,
  Document: true,
  DocumentExit: true,
  Once: true,
  OnceExit: true,
  postcssPlugin: true,
  prepare: true,
  Root: true,
  RootExit: true,
  Rule: true,
  RuleExit: true
}

const NOT_VISITORS = {
  Once: true,
  postcssPlugin: true,
  prepare: true
}

const CHILDREN = 0

function isPromise(obj) {
  return typeof obj === 'object' && typeof obj.then === 'function'
}

function getEvents(node) {
  let key = false
  let type = TYPE_TO_CLASS_NAME[node.type]
  if (node.type === 'decl') {
    key = node.prop.toLowerCase()
  } else if (node.type === 'atrule') {
    key = node.name.toLowerCase()
  }

  if (key && node.append) {
    return [
      type,
      type + '-' + key,
      CHILDREN,
      type + 'Exit',
      type + 'Exit-' + key
    ]
  } else if (key) {
    return [type, type + '-' + key, type + 'Exit', type + 'Exit-' + key]
  } else if (node.append) {
    return [type, CHILDREN, type + 'Exit']
  } else {
    return [type, type + 'Exit']
  }
}

function toStack(node) {
  let events
  if (node.type === 'document') {
    events = ['Document', CHILDREN, 'DocumentExit']
  } else if (node.type === 'root') {
    events = ['Root', CHILDREN, 'RootExit']
  } else {
    events = getEvents(node)
  }

  return {
    eventIndex: 0,
    events,
    iterator: 0,
    node,
    visitorIndex: 0,
    visitors: []
  }
}

function cleanMarks(node) {
  node[isClean] = false
  if (node.nodes) node.nodes.forEach(i => cleanMarks(i))
  return node
}

let postcss = {}

class LazyResult {
  constructor(processor, css, opts) {
    this.stringified = false
    this.processed = false

    let root
    if (
      typeof css === 'object' &&
      css !== null &&
      (css.type === 'root' || css.type === 'document')
    ) {
      root = cleanMarks(css)
    } else if (css instanceof LazyResult || css instanceof Result) {
      root = cleanMarks(css.root)
      if (css.map) {
        if (typeof opts.map === 'undefined') opts.map = {}
        if (!opts.map.inline) opts.map.inline = false
        opts.map.prev = css.map
      }
    } else {
      let parser = parse
      if (opts.syntax) parser = opts.syntax.parse
      if (opts.parser) parser = opts.parser
      if (parser.parse) parser = parser.parse

      try {
        root = parser(css, opts)
      } catch (error) {
        this.processed = true
        this.error = error
      }

      if (root && !root[my]) {
        /* c8 ignore next 2 */
        Container.rebuild(root)
      }
    }

    this.result = new Result(processor, root, opts)
    this.helpers = { ...postcss, postcss, result: this.result }
    this.plugins = this.processor.plugins.map(plugin => {
      if (typeof plugin === 'object' && plugin.prepare) {
        return { ...plugin, ...plugin.prepare(this.result) }
      } else {
        return plugin
      }
    })
  }

  async() {
    if (this.error) return Promise.reject(this.error)
    if (this.processed) return Promise.resolve(this.result)
    if (!this.processing) {
      this.processing = this.runAsync()
    }
    return this.processing
  }

  catch(onRejected) {
    return this.async().catch(onRejected)
  }

  finally(onFinally) {
    return this.async().then(onFinally, onFinally)
  }

  getAsyncError() {
    throw new Error('Use process(css).then(cb) to work with async plugins')
  }

  handleError(error, node) {
    let plugin = this.result.lastPlugin
    try {
      if (node) node.addToError(error)
      this.error = error
      if (error.name === 'CssSyntaxError' && !error.plugin) {
        error.plugin = plugin.postcssPlugin
        error.setMessage()
      } else if (plugin.postcssVersion) {
        if (process.env.NODE_ENV !== 'production') {
          let pluginName = plugin.postcssPlugin
          let pluginVer = plugin.postcssVersion
          let runtimeVer = this.result.processor.version
          let a = pluginVer.split('.')
          let b = runtimeVer.split('.')

          if (a[0] !== b[0] || parseInt(a[1]) > parseInt(b[1])) {
            // eslint-disable-next-line no-console
            console.error(
              'Unknown error from PostCSS plugin. Your current PostCSS ' +
                'version is ' +
                runtimeVer +
                ', but ' +
                pluginName +
                ' uses ' +
                pluginVer +
                '. Perhaps this is the source of the error below.'
            )
          }
        }
      }
    } catch (err) {
      /* c8 ignore next 3 */
      // eslint-disable-next-line no-console
      if (console && console.error) console.error(err)
    }
    return error
  }

  prepareVisitors() {
    this.listeners = {}
    let add = (plugin, type, cb) => {
      if (!this.listeners[type]) this.listeners[type] = []
      this.listeners[type].push([plugin, cb])
    }
    for (let plugin of this.plugins) {
      if (typeof plugin === 'object') {
        for (let event in plugin) {
          if (!PLUGIN_PROPS[event] && /^[A-Z]/.test(event)) {
            throw new Error(
              `Unknown event ${event} in ${plugin.postcssPlugin}. ` +
                `Try to update PostCSS (${this.processor.version} now).`
            )
          }
          if (!NOT_VISITORS[event]) {
            if (typeof plugin[event] === 'object') {
              for (let filter in plugin[event]) {
                if (filter === '*') {
                  add(plugin, event, plugin[event][filter])
                } else {
                  add(
                    plugin,
                    event + '-' + filter.toLowerCase(),
                    plugin[event][filter]
                  )
                }
              }
            } else if (typeof plugin[event] === 'function') {
              add(plugin, event, plugin[event])
            }
          }
        }
      }
    }
    this.hasListener = Object.keys(this.listeners).length > 0
  }

  async runAsync() {
    this.plugin = 0
    for (let i = 0; i < this.plugins.length; i++) {
      let plugin = this.plugins[i]
      let promise = this.runOnRoot(plugin)
      if (isPromise(promise)) {
        try {
          await promise
        } catch (error) {
          throw this.handleError(error)
        }
      }
    }

    this.prepareVisitors()
    if (this.hasListener) {
      let root = this.result.root
      while (!root[isClean]) {
        root[isClean] = true
        let stack = [toStack(root)]
        while (stack.length > 0) {
          let promise = this.visitTick(stack)
          if (isPromise(promise)) {
            try {
              await promise
            } catch (e) {
              let node = stack[stack.length - 1].node
              throw this.handleError(e, node)
            }
          }
        }
      }

      if (this.listeners.OnceExit) {
        for (let [plugin, visitor] of this.listeners.OnceExit) {
          this.result.lastPlugin = plugin
          try {
            if (root.type === 'document') {
              let roots = root.nodes.map(subRoot =>
                visitor(subRoot, this.helpers)
              )

              await Promise.all(roots)
            } else {
              await visitor(root, this.helpers)
            }
          } catch (e) {
            throw this.handleError(e)
          }
        }
      }
    }

    this.processed = true
    return this.stringify()
  }

  runOnRoot(plugin) {
    this.result.lastPlugin = plugin
    try {
      if (typeof plugin === 'object' && plugin.Once) {
        if (this.result.root.type === 'document') {
          let roots = this.result.root.nodes.map(root =>
            plugin.Once(root, this.helpers)
          )

          if (isPromise(roots[0])) {
            return Promise.all(roots)
          }

          return roots
        }

        return plugin.Once(this.result.root, this.helpers)
      } else if (typeof plugin === 'function') {
        return plugin(this.result.root, this.result)
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  stringify() {
    if (this.error) throw this.error
    if (this.stringified) return this.result
    this.stringified = true

    this.sync()

    let opts = this.result.opts
    let str = stringify
    if (opts.syntax) str = opts.syntax.stringify
    if (opts.stringifier) str = opts.stringifier
    if (str.stringify) str = str.stringify

    let map = new MapGenerator(str, this.result.root, this.result.opts)
    let data = map.generate()
    this.result.css = data[0]
    this.result.map = data[1]

    return this.result
  }

  sync() {
    if (this.error) throw this.error
    if (this.processed) return this.result
    this.processed = true

    if (this.processing) {
      throw this.getAsyncError()
    }

    for (let plugin of this.plugins) {
      let promise = this.runOnRoot(plugin)
      if (isPromise(promise)) {
        throw this.getAsyncError()
      }
    }

    this.prepareVisitors()
    if (this.hasListener) {
      let root = this.result.root
      while (!root[isClean]) {
        root[isClean] = true
        this.walkSync(root)
      }
      if (this.listeners.OnceExit) {
        if (root.type === 'document') {
          for (let subRoot of root.nodes) {
            this.visitSync(this.listeners.OnceExit, subRoot)
          }
        } else {
          this.visitSync(this.listeners.OnceExit, root)
        }
      }
    }

    return this.result
  }

  then(onFulfilled, onRejected) {
    if (process.env.NODE_ENV !== 'production') {
      if (!('from' in this.opts)) {
        warnOnce(
          'Without `from` option PostCSS could generate wrong source map ' +
            'and will not find Browserslist config. Set it to CSS file path ' +
            'or to `undefined` to prevent this warning.'
        )
      }
    }
    return this.async().then(onFulfilled, onRejected)
  }

  toString() {
    return this.css
  }

  visitSync(visitors, node) {
    for (let [plugin, visitor] of visitors) {
      this.result.lastPlugin = plugin
      let promise
      try {
        promise = visitor(node, this.helpers)
      } catch (e) {
        throw this.handleError(e, node.proxyOf)
      }
      if (node.type !== 'root' && node.type !== 'document' && !node.parent) {
        return true
      }
      if (isPromise(promise)) {
        throw this.getAsyncError()
      }
    }
  }

  visitTick(stack) {
    let visit = stack[stack.length - 1]
    let { node, visitors } = visit

    if (node.type !== 'root' && node.type !== 'document' && !node.parent) {
      stack.pop()
      return
    }

    if (visitors.length > 0 && visit.visitorIndex < visitors.length) {
      let [plugin, visitor] = visitors[visit.visitorIndex]
      visit.visitorIndex += 1
      if (visit.visitorIndex === visitors.length) {
        visit.visitors = []
        visit.visitorIndex = 0
      }
      this.result.lastPlugin = plugin
      try {
        return visitor(node.toProxy(), this.helpers)
      } catch (e) {
        throw this.handleError(e, node)
      }
    }

    if (visit.iterator !== 0) {
      let iterator = visit.iterator
      let child
      while ((child = node.nodes[node.indexes[iterator]])) {
        node.indexes[iterator] += 1
        if (!child[isClean]) {
          child[isClean] = true
          stack.push(toStack(child))
          return
        }
      }
      visit.iterator = 0
      delete node.indexes[iterator]
    }

    let events = visit.events
    while (visit.eventIndex < events.length) {
      let event = events[visit.eventIndex]
      visit.eventIndex += 1
      if (event === CHILDREN) {
        if (node.nodes && node.nodes.length) {
          node[isClean] = true
          visit.iterator = node.getIterator()
        }
        return
      } else if (this.listeners[event]) {
        visit.visitors = this.listeners[event]
        return
      }
    }
    stack.pop()
  }

  walkSync(node) {
    node[isClean] = true
    let events = getEvents(node)
    for (let event of events) {
      if (event === CHILDREN) {
        if (node.nodes) {
          node.each(child => {
            if (!child[isClean]) this.walkSync(child)
          })
        }
      } else {
        let visitors = this.listeners[event]
        if (visitors) {
          if (this.visitSync(visitors, node.toProxy())) return
        }
      }
    }
  }

  warnings() {
    return this.sync().warnings()
  }

  get content() {
    return this.stringify().content
  }

  get css() {
    return this.stringify().css
  }

  get map() {
    return this.stringify().map
  }

  get messages() {
    return this.sync().messages
  }

  get opts() {
    return this.result.opts
  }

  get processor() {
    return this.result.processor
  }

  get root() {
    return this.sync().root
  }

  get [Symbol.toStringTag]() {
    return 'LazyResult'
  }
}

LazyResult.registerPostcss = dependant => {
  postcss = dependant
}

module.exports = LazyResult
LazyResult.default = LazyResult

Root.registerLazyResult(LazyResult)
Document.registerLazyResult(LazyResult)

}).call(this)}).call(this,require('_process'))
},{"./container":15,"./document":18,"./map-generator":23,"./parse":26,"./result":31,"./root":32,"./stringify":35,"./symbols":36,"./warn-once":38,"_process":40}],22:[function(require,module,exports){
'use strict'

let list = {
  comma(string) {
    return list.split(string, [','], true)
  },

  space(string) {
    let spaces = [' ', '\n', '\t']
    return list.split(string, spaces)
  },

  split(string, separators, last) {
    let array = []
    let current = ''
    let split = false

    let func = 0
    let inQuote = false
    let prevQuote = ''
    let escape = false

    for (let letter of string) {
      if (escape) {
        escape = false
      } else if (letter === '\\') {
        escape = true
      } else if (inQuote) {
        if (letter === prevQuote) {
          inQuote = false
        }
      } else if (letter === '"' || letter === "'") {
        inQuote = true
        prevQuote = letter
      } else if (letter === '(') {
        func += 1
      } else if (letter === ')') {
        if (func > 0) func -= 1
      } else if (func === 0) {
        if (separators.includes(letter)) split = true
      }

      if (split) {
        if (current !== '') array.push(current.trim())
        current = ''
        split = false
      } else {
        current += letter
      }
    }

    if (last || current !== '') array.push(current.trim())
    return array
  }
}

module.exports = list
list.default = list

},{}],23:[function(require,module,exports){
(function (Buffer){(function (){
'use strict'

let { SourceMapConsumer, SourceMapGenerator } = require('source-map-js')
let { dirname, relative, resolve, sep } = require('path')
let { pathToFileURL } = require('url')

let Input = require('./input')

let sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator)
let pathAvailable = Boolean(dirname && resolve && relative && sep)

class MapGenerator {
  constructor(stringify, root, opts, cssString) {
    this.stringify = stringify
    this.mapOpts = opts.map || {}
    this.root = root
    this.opts = opts
    this.css = cssString
    this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute

    this.memoizedFileURLs = new Map()
    this.memoizedPaths = new Map()
    this.memoizedURLs = new Map()
  }

  addAnnotation() {
    let content

    if (this.isInline()) {
      content =
        'data:application/json;base64,' + this.toBase64(this.map.toString())
    } else if (typeof this.mapOpts.annotation === 'string') {
      content = this.mapOpts.annotation
    } else if (typeof this.mapOpts.annotation === 'function') {
      content = this.mapOpts.annotation(this.opts.to, this.root)
    } else {
      content = this.outputFile() + '.map'
    }
    let eol = '\n'
    if (this.css.includes('\r\n')) eol = '\r\n'

    this.css += eol + '/*# sourceMappingURL=' + content + ' */'
  }

  applyPrevMaps() {
    for (let prev of this.previous()) {
      let from = this.toUrl(this.path(prev.file))
      let root = prev.root || dirname(prev.file)
      let map

      if (this.mapOpts.sourcesContent === false) {
        map = new SourceMapConsumer(prev.text)
        if (map.sourcesContent) {
          map.sourcesContent = map.sourcesContent.map(() => null)
        }
      } else {
        map = prev.consumer()
      }

      this.map.applySourceMap(map, from, this.toUrl(this.path(root)))
    }
  }

  clearAnnotation() {
    if (this.mapOpts.annotation === false) return

    if (this.root) {
      let node
      for (let i = this.root.nodes.length - 1; i >= 0; i--) {
        node = this.root.nodes[i]
        if (node.type !== 'comment') continue
        if (node.text.indexOf('# sourceMappingURL=') === 0) {
          this.root.removeChild(i)
        }
      }
    } else if (this.css) {
      this.css = this.css.replace(/(\n)?\/\*#[\S\s]*?\*\/$/gm, '')
    }
  }

  generate() {
    this.clearAnnotation()
    if (pathAvailable && sourceMapAvailable && this.isMap()) {
      return this.generateMap()
    } else {
      let result = ''
      this.stringify(this.root, i => {
        result += i
      })
      return [result]
    }
  }

  generateMap() {
    if (this.root) {
      this.generateString()
    } else if (this.previous().length === 1) {
      let prev = this.previous()[0].consumer()
      prev.file = this.outputFile()
      this.map = SourceMapGenerator.fromSourceMap(prev)
    } else {
      this.map = new SourceMapGenerator({ file: this.outputFile() })
      this.map.addMapping({
        generated: { column: 0, line: 1 },
        original: { column: 0, line: 1 },
        source: this.opts.from
          ? this.toUrl(this.path(this.opts.from))
          : '<no source>'
      })
    }

    if (this.isSourcesContent()) this.setSourcesContent()
    if (this.root && this.previous().length > 0) this.applyPrevMaps()
    if (this.isAnnotation()) this.addAnnotation()

    if (this.isInline()) {
      return [this.css]
    } else {
      return [this.css, this.map]
    }
  }

  generateString() {
    this.css = ''
    this.map = new SourceMapGenerator({ file: this.outputFile() })

    let line = 1
    let column = 1

    let noSource = '<no source>'
    let mapping = {
      generated: { column: 0, line: 0 },
      original: { column: 0, line: 0 },
      source: ''
    }

    let lines, last
    this.stringify(this.root, (str, node, type) => {
      this.css += str

      if (node && type !== 'end') {
        mapping.generated.line = line
        mapping.generated.column = column - 1
        if (node.source && node.source.start) {
          mapping.source = this.sourcePath(node)
          mapping.original.line = node.source.start.line
          mapping.original.column = node.source.start.column - 1
          this.map.addMapping(mapping)
        } else {
          mapping.source = noSource
          mapping.original.line = 1
          mapping.original.column = 0
          this.map.addMapping(mapping)
        }
      }

      lines = str.match(/\n/g)
      if (lines) {
        line += lines.length
        last = str.lastIndexOf('\n')
        column = str.length - last
      } else {
        column += str.length
      }

      if (node && type !== 'start') {
        let p = node.parent || { raws: {} }
        let childless =
          node.type === 'decl' || (node.type === 'atrule' && !node.nodes)
        if (!childless || node !== p.last || p.raws.semicolon) {
          if (node.source && node.source.end) {
            mapping.source = this.sourcePath(node)
            mapping.original.line = node.source.end.line
            mapping.original.column = node.source.end.column - 1
            mapping.generated.line = line
            mapping.generated.column = column - 2
            this.map.addMapping(mapping)
          } else {
            mapping.source = noSource
            mapping.original.line = 1
            mapping.original.column = 0
            mapping.generated.line = line
            mapping.generated.column = column - 1
            this.map.addMapping(mapping)
          }
        }
      }
    })
  }

  isAnnotation() {
    if (this.isInline()) {
      return true
    }
    if (typeof this.mapOpts.annotation !== 'undefined') {
      return this.mapOpts.annotation
    }
    if (this.previous().length) {
      return this.previous().some(i => i.annotation)
    }
    return true
  }

  isInline() {
    if (typeof this.mapOpts.inline !== 'undefined') {
      return this.mapOpts.inline
    }

    let annotation = this.mapOpts.annotation
    if (typeof annotation !== 'undefined' && annotation !== true) {
      return false
    }

    if (this.previous().length) {
      return this.previous().some(i => i.inline)
    }
    return true
  }

  isMap() {
    if (typeof this.opts.map !== 'undefined') {
      return !!this.opts.map
    }
    return this.previous().length > 0
  }

  isSourcesContent() {
    if (typeof this.mapOpts.sourcesContent !== 'undefined') {
      return this.mapOpts.sourcesContent
    }
    if (this.previous().length) {
      return this.previous().some(i => i.withContent())
    }
    return true
  }

  outputFile() {
    if (this.opts.to) {
      return this.path(this.opts.to)
    } else if (this.opts.from) {
      return this.path(this.opts.from)
    } else {
      return 'to.css'
    }
  }

  path(file) {
    if (this.mapOpts.absolute) return file
    if (file.charCodeAt(0) === 60 /* `<` */) return file
    if (/^\w+:\/\//.test(file)) return file
    let cached = this.memoizedPaths.get(file)
    if (cached) return cached

    let from = this.opts.to ? dirname(this.opts.to) : '.'

    if (typeof this.mapOpts.annotation === 'string') {
      from = dirname(resolve(from, this.mapOpts.annotation))
    }

    let path = relative(from, file)
    this.memoizedPaths.set(file, path)

    return path
  }

  previous() {
    if (!this.previousMaps) {
      this.previousMaps = []
      if (this.root) {
        this.root.walk(node => {
          if (node.source && node.source.input.map) {
            let map = node.source.input.map
            if (!this.previousMaps.includes(map)) {
              this.previousMaps.push(map)
            }
          }
        })
      } else {
        let input = new Input(this.css, this.opts)
        if (input.map) this.previousMaps.push(input.map)
      }
    }

    return this.previousMaps
  }

  setSourcesContent() {
    let already = {}
    if (this.root) {
      this.root.walk(node => {
        if (node.source) {
          let from = node.source.input.from
          if (from && !already[from]) {
            already[from] = true
            let fromUrl = this.usesFileUrls
              ? this.toFileUrl(from)
              : this.toUrl(this.path(from))
            this.map.setSourceContent(fromUrl, node.source.input.css)
          }
        }
      })
    } else if (this.css) {
      let from = this.opts.from
        ? this.toUrl(this.path(this.opts.from))
        : '<no source>'
      this.map.setSourceContent(from, this.css)
    }
  }

  sourcePath(node) {
    if (this.mapOpts.from) {
      return this.toUrl(this.mapOpts.from)
    } else if (this.usesFileUrls) {
      return this.toFileUrl(node.source.input.from)
    } else {
      return this.toUrl(this.path(node.source.input.from))
    }
  }

  toBase64(str) {
    if (Buffer) {
      return Buffer.from(str).toString('base64')
    } else {
      return window.btoa(unescape(encodeURIComponent(str)))
    }
  }

  toFileUrl(path) {
    let cached = this.memoizedFileURLs.get(path)
    if (cached) return cached

    if (pathToFileURL) {
      let fileURL = pathToFileURL(path).toString()
      this.memoizedFileURLs.set(path, fileURL)

      return fileURL
    } else {
      throw new Error(
        '`map.absolute` option is not available in this PostCSS build'
      )
    }
  }

  toUrl(path) {
    let cached = this.memoizedURLs.get(path)
    if (cached) return cached

    if (sep === '\\') {
      path = path.replace(/\\/g, '/')
    }

    let url = encodeURI(path).replace(/[#?]/g, encodeURIComponent)
    this.memoizedURLs.set(path, url)

    return url
  }
}

module.exports = MapGenerator

}).call(this)}).call(this,require("buffer").Buffer)
},{"./input":20,"buffer":7,"path":6,"source-map-js":6,"url":6}],24:[function(require,module,exports){
(function (process){(function (){
'use strict'

let MapGenerator = require('./map-generator')
let stringify = require('./stringify')
let warnOnce = require('./warn-once')
let parse = require('./parse')
const Result = require('./result')

class NoWorkResult {
  constructor(processor, css, opts) {
    css = css.toString()
    this.stringified = false

    this._processor = processor
    this._css = css
    this._opts = opts
    this._map = undefined
    let root

    let str = stringify
    this.result = new Result(this._processor, root, this._opts)
    this.result.css = css

    let self = this
    Object.defineProperty(this.result, 'root', {
      get() {
        return self.root
      }
    })

    let map = new MapGenerator(str, root, this._opts, css)
    if (map.isMap()) {
      let [generatedCSS, generatedMap] = map.generate()
      if (generatedCSS) {
        this.result.css = generatedCSS
      }
      if (generatedMap) {
        this.result.map = generatedMap
      }
    }
  }

  async() {
    if (this.error) return Promise.reject(this.error)
    return Promise.resolve(this.result)
  }

  catch(onRejected) {
    return this.async().catch(onRejected)
  }

  finally(onFinally) {
    return this.async().then(onFinally, onFinally)
  }

  sync() {
    if (this.error) throw this.error
    return this.result
  }

  then(onFulfilled, onRejected) {
    if (process.env.NODE_ENV !== 'production') {
      if (!('from' in this._opts)) {
        warnOnce(
          'Without `from` option PostCSS could generate wrong source map ' +
            'and will not find Browserslist config. Set it to CSS file path ' +
            'or to `undefined` to prevent this warning.'
        )
      }
    }

    return this.async().then(onFulfilled, onRejected)
  }

  toString() {
    return this._css
  }

  warnings() {
    return []
  }

  get content() {
    return this.result.css
  }

  get css() {
    return this.result.css
  }

  get map() {
    return this.result.map
  }

  get messages() {
    return []
  }

  get opts() {
    return this.result.opts
  }

  get processor() {
    return this.result.processor
  }

  get root() {
    if (this._root) {
      return this._root
    }

    let root
    let parser = parse

    try {
      root = parser(this._css, this._opts)
    } catch (error) {
      this.error = error
    }

    if (this.error) {
      throw this.error
    } else {
      this._root = root
      return root
    }
  }

  get [Symbol.toStringTag]() {
    return 'NoWorkResult'
  }
}

module.exports = NoWorkResult
NoWorkResult.default = NoWorkResult

}).call(this)}).call(this,require('_process'))
},{"./map-generator":23,"./parse":26,"./result":31,"./stringify":35,"./warn-once":38,"_process":40}],25:[function(require,module,exports){
'use strict'

let { isClean, my } = require('./symbols')
let CssSyntaxError = require('./css-syntax-error')
let Stringifier = require('./stringifier')
let stringify = require('./stringify')

function cloneNode(obj, parent) {
  let cloned = new obj.constructor()

  for (let i in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, i)) {
      /* c8 ignore next 2 */
      continue
    }
    if (i === 'proxyCache') continue
    let value = obj[i]
    let type = typeof value

    if (i === 'parent' && type === 'object') {
      if (parent) cloned[i] = parent
    } else if (i === 'source') {
      cloned[i] = value
    } else if (Array.isArray(value)) {
      cloned[i] = value.map(j => cloneNode(j, cloned))
    } else {
      if (type === 'object' && value !== null) value = cloneNode(value)
      cloned[i] = value
    }
  }

  return cloned
}

class Node {
  constructor(defaults = {}) {
    this.raws = {}
    this[isClean] = false
    this[my] = true

    for (let name in defaults) {
      if (name === 'nodes') {
        this.nodes = []
        for (let node of defaults[name]) {
          if (typeof node.clone === 'function') {
            this.append(node.clone())
          } else {
            this.append(node)
          }
        }
      } else {
        this[name] = defaults[name]
      }
    }
  }

  addToError(error) {
    error.postcssNode = this
    if (error.stack && this.source && /\n\s{4}at /.test(error.stack)) {
      let s = this.source
      error.stack = error.stack.replace(
        /\n\s{4}at /,
        `$&${s.input.from}:${s.start.line}:${s.start.column}$&`
      )
    }
    return error
  }

  after(add) {
    this.parent.insertAfter(this, add)
    return this
  }

  assign(overrides = {}) {
    for (let name in overrides) {
      this[name] = overrides[name]
    }
    return this
  }

  before(add) {
    this.parent.insertBefore(this, add)
    return this
  }

  cleanRaws(keepBetween) {
    delete this.raws.before
    delete this.raws.after
    if (!keepBetween) delete this.raws.between
  }

  clone(overrides = {}) {
    let cloned = cloneNode(this)
    for (let name in overrides) {
      cloned[name] = overrides[name]
    }
    return cloned
  }

  cloneAfter(overrides = {}) {
    let cloned = this.clone(overrides)
    this.parent.insertAfter(this, cloned)
    return cloned
  }

  cloneBefore(overrides = {}) {
    let cloned = this.clone(overrides)
    this.parent.insertBefore(this, cloned)
    return cloned
  }

  error(message, opts = {}) {
    if (this.source) {
      let { end, start } = this.rangeBy(opts)
      return this.source.input.error(
        message,
        { column: start.column, line: start.line },
        { column: end.column, line: end.line },
        opts
      )
    }
    return new CssSyntaxError(message)
  }

  getProxyProcessor() {
    return {
      get(node, prop) {
        if (prop === 'proxyOf') {
          return node
        } else if (prop === 'root') {
          return () => node.root().toProxy()
        } else {
          return node[prop]
        }
      },

      set(node, prop, value) {
        if (node[prop] === value) return true
        node[prop] = value
        if (
          prop === 'prop' ||
          prop === 'value' ||
          prop === 'name' ||
          prop === 'params' ||
          prop === 'important' ||
          /* c8 ignore next */
          prop === 'text'
        ) {
          node.markDirty()
        }
        return true
      }
    }
  }

  markDirty() {
    if (this[isClean]) {
      this[isClean] = false
      let next = this
      while ((next = next.parent)) {
        next[isClean] = false
      }
    }
  }

  next() {
    if (!this.parent) return undefined
    let index = this.parent.index(this)
    return this.parent.nodes[index + 1]
  }

  positionBy(opts, stringRepresentation) {
    let pos = this.source.start
    if (opts.index) {
      pos = this.positionInside(opts.index, stringRepresentation)
    } else if (opts.word) {
      stringRepresentation = this.toString()
      let index = stringRepresentation.indexOf(opts.word)
      if (index !== -1) pos = this.positionInside(index, stringRepresentation)
    }
    return pos
  }

  positionInside(index, stringRepresentation) {
    let string = stringRepresentation || this.toString()
    let column = this.source.start.column
    let line = this.source.start.line

    for (let i = 0; i < index; i++) {
      if (string[i] === '\n') {
        column = 1
        line += 1
      } else {
        column += 1
      }
    }

    return { column, line }
  }

  prev() {
    if (!this.parent) return undefined
    let index = this.parent.index(this)
    return this.parent.nodes[index - 1]
  }

  rangeBy(opts) {
    let start = {
      column: this.source.start.column,
      line: this.source.start.line
    }
    let end = this.source.end
      ? {
        column: this.source.end.column + 1,
        line: this.source.end.line
      }
      : {
        column: start.column + 1,
        line: start.line
      }

    if (opts.word) {
      let stringRepresentation = this.toString()
      let index = stringRepresentation.indexOf(opts.word)
      if (index !== -1) {
        start = this.positionInside(index, stringRepresentation)
        end = this.positionInside(index + opts.word.length, stringRepresentation)
      }
    } else {
      if (opts.start) {
        start = {
          column: opts.start.column,
          line: opts.start.line
        }
      } else if (opts.index) {
        start = this.positionInside(opts.index)
      }

      if (opts.end) {
        end = {
          column: opts.end.column,
          line: opts.end.line
        }
      } else if (opts.endIndex) {
        end = this.positionInside(opts.endIndex)
      } else if (opts.index) {
        end = this.positionInside(opts.index + 1)
      }
    }

    if (
      end.line < start.line ||
      (end.line === start.line && end.column <= start.column)
    ) {
      end = { column: start.column + 1, line: start.line }
    }

    return { end, start }
  }

  raw(prop, defaultType) {
    let str = new Stringifier()
    return str.raw(this, prop, defaultType)
  }

  remove() {
    if (this.parent) {
      this.parent.removeChild(this)
    }
    this.parent = undefined
    return this
  }

  replaceWith(...nodes) {
    if (this.parent) {
      let bookmark = this
      let foundSelf = false
      for (let node of nodes) {
        if (node === this) {
          foundSelf = true
        } else if (foundSelf) {
          this.parent.insertAfter(bookmark, node)
          bookmark = node
        } else {
          this.parent.insertBefore(bookmark, node)
        }
      }

      if (!foundSelf) {
        this.remove()
      }
    }

    return this
  }

  root() {
    let result = this
    while (result.parent && result.parent.type !== 'document') {
      result = result.parent
    }
    return result
  }

  toJSON(_, inputs) {
    let fixed = {}
    let emitInputs = inputs == null
    inputs = inputs || new Map()
    let inputsNextIndex = 0

    for (let name in this) {
      if (!Object.prototype.hasOwnProperty.call(this, name)) {
        /* c8 ignore next 2 */
        continue
      }
      if (name === 'parent' || name === 'proxyCache') continue
      let value = this[name]

      if (Array.isArray(value)) {
        fixed[name] = value.map(i => {
          if (typeof i === 'object' && i.toJSON) {
            return i.toJSON(null, inputs)
          } else {
            return i
          }
        })
      } else if (typeof value === 'object' && value.toJSON) {
        fixed[name] = value.toJSON(null, inputs)
      } else if (name === 'source') {
        let inputId = inputs.get(value.input)
        if (inputId == null) {
          inputId = inputsNextIndex
          inputs.set(value.input, inputsNextIndex)
          inputsNextIndex++
        }
        fixed[name] = {
          end: value.end,
          inputId,
          start: value.start
        }
      } else {
        fixed[name] = value
      }
    }

    if (emitInputs) {
      fixed.inputs = [...inputs.keys()].map(input => input.toJSON())
    }

    return fixed
  }

  toProxy() {
    if (!this.proxyCache) {
      this.proxyCache = new Proxy(this, this.getProxyProcessor())
    }
    return this.proxyCache
  }

  toString(stringifier = stringify) {
    if (stringifier.stringify) stringifier = stringifier.stringify
    let result = ''
    stringifier(this, i => {
      result += i
    })
    return result
  }

  warn(result, text, opts) {
    let data = { node: this }
    for (let i in opts) data[i] = opts[i]
    return result.warn(text, data)
  }

  get proxyOf() {
    return this
  }
}

module.exports = Node
Node.default = Node

},{"./css-syntax-error":16,"./stringifier":34,"./stringify":35,"./symbols":36}],26:[function(require,module,exports){
(function (process){(function (){
'use strict'

let Container = require('./container')
let Parser = require('./parser')
let Input = require('./input')

function parse(css, opts) {
  let input = new Input(css, opts)
  let parser = new Parser(input)
  try {
    parser.parse()
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      if (e.name === 'CssSyntaxError' && opts && opts.from) {
        if (/\.scss$/i.test(opts.from)) {
          e.message +=
            '\nYou tried to parse SCSS with ' +
            'the standard CSS parser; ' +
            'try again with the postcss-scss parser'
        } else if (/\.sass/i.test(opts.from)) {
          e.message +=
            '\nYou tried to parse Sass with ' +
            'the standard CSS parser; ' +
            'try again with the postcss-sass parser'
        } else if (/\.less$/i.test(opts.from)) {
          e.message +=
            '\nYou tried to parse Less with ' +
            'the standard CSS parser; ' +
            'try again with the postcss-less parser'
        }
      }
    }
    throw e
  }

  return parser.root
}

module.exports = parse
parse.default = parse

Container.registerParse(parse)

}).call(this)}).call(this,require('_process'))
},{"./container":15,"./input":20,"./parser":27,"_process":40}],27:[function(require,module,exports){
'use strict'

let Declaration = require('./declaration')
let tokenizer = require('./tokenize')
let Comment = require('./comment')
let AtRule = require('./at-rule')
let Root = require('./root')
let Rule = require('./rule')

const SAFE_COMMENT_NEIGHBOR = {
  empty: true,
  space: true
}

function findLastWithPosition(tokens) {
  for (let i = tokens.length - 1; i >= 0; i--) {
    let token = tokens[i]
    let pos = token[3] || token[2]
    if (pos) return pos
  }
}

class Parser {
  constructor(input) {
    this.input = input

    this.root = new Root()
    this.current = this.root
    this.spaces = ''
    this.semicolon = false
    this.customProperty = false

    this.createTokenizer()
    this.root.source = { input, start: { column: 1, line: 1, offset: 0 } }
  }

  atrule(token) {
    let node = new AtRule()
    node.name = token[1].slice(1)
    if (node.name === '') {
      this.unnamedAtrule(node, token)
    }
    this.init(node, token[2])

    let type
    let prev
    let shift
    let last = false
    let open = false
    let params = []
    let brackets = []

    while (!this.tokenizer.endOfFile()) {
      token = this.tokenizer.nextToken()
      type = token[0]

      if (type === '(' || type === '[') {
        brackets.push(type === '(' ? ')' : ']')
      } else if (type === '{' && brackets.length > 0) {
        brackets.push('}')
      } else if (type === brackets[brackets.length - 1]) {
        brackets.pop()
      }

      if (brackets.length === 0) {
        if (type === ';') {
          node.source.end = this.getPosition(token[2])
          node.source.end.offset++
          this.semicolon = true
          break
        } else if (type === '{') {
          open = true
          break
        } else if (type === '}') {
          if (params.length > 0) {
            shift = params.length - 1
            prev = params[shift]
            while (prev && prev[0] === 'space') {
              prev = params[--shift]
            }
            if (prev) {
              node.source.end = this.getPosition(prev[3] || prev[2])
              node.source.end.offset++
            }
          }
          this.end(token)
          break
        } else {
          params.push(token)
        }
      } else {
        params.push(token)
      }

      if (this.tokenizer.endOfFile()) {
        last = true
        break
      }
    }

    node.raws.between = this.spacesAndCommentsFromEnd(params)
    if (params.length) {
      node.raws.afterName = this.spacesAndCommentsFromStart(params)
      this.raw(node, 'params', params)
      if (last) {
        token = params[params.length - 1]
        node.source.end = this.getPosition(token[3] || token[2])
        node.source.end.offset++
        this.spaces = node.raws.between
        node.raws.between = ''
      }
    } else {
      node.raws.afterName = ''
      node.params = ''
    }

    if (open) {
      node.nodes = []
      this.current = node
    }
  }

  checkMissedSemicolon(tokens) {
    let colon = this.colon(tokens)
    if (colon === false) return

    let founded = 0
    let token
    for (let j = colon - 1; j >= 0; j--) {
      token = tokens[j]
      if (token[0] !== 'space') {
        founded += 1
        if (founded === 2) break
      }
    }
    // If the token is a word, e.g. `!important`, `red` or any other valid property's value.
    // Then we need to return the colon after that word token. [3] is the "end" colon of that word.
    // And because we need it after that one we do +1 to get the next one.
    throw this.input.error(
      'Missed semicolon',
      token[0] === 'word' ? token[3] + 1 : token[2]
    )
  }

  colon(tokens) {
    let brackets = 0
    let token, type, prev
    for (let [i, element] of tokens.entries()) {
      token = element
      type = token[0]

      if (type === '(') {
        brackets += 1
      }
      if (type === ')') {
        brackets -= 1
      }
      if (brackets === 0 && type === ':') {
        if (!prev) {
          this.doubleColon(token)
        } else if (prev[0] === 'word' && prev[1] === 'progid') {
          continue
        } else {
          return i
        }
      }

      prev = token
    }
    return false
  }

  comment(token) {
    let node = new Comment()
    this.init(node, token[2])
    node.source.end = this.getPosition(token[3] || token[2])
    node.source.end.offset++

    let text = token[1].slice(2, -2)
    if (/^\s*$/.test(text)) {
      node.text = ''
      node.raws.left = text
      node.raws.right = ''
    } else {
      let match = text.match(/^(\s*)([^]*\S)(\s*)$/)
      node.text = match[2]
      node.raws.left = match[1]
      node.raws.right = match[3]
    }
  }

  createTokenizer() {
    this.tokenizer = tokenizer(this.input)
  }

  decl(tokens, customProperty) {
    let node = new Declaration()
    this.init(node, tokens[0][2])

    let last = tokens[tokens.length - 1]
    if (last[0] === ';') {
      this.semicolon = true
      tokens.pop()
    }

    node.source.end = this.getPosition(
      last[3] || last[2] || findLastWithPosition(tokens)
    )
    node.source.end.offset++

    while (tokens[0][0] !== 'word') {
      if (tokens.length === 1) this.unknownWord(tokens)
      node.raws.before += tokens.shift()[1]
    }
    node.source.start = this.getPosition(tokens[0][2])

    node.prop = ''
    while (tokens.length) {
      let type = tokens[0][0]
      if (type === ':' || type === 'space' || type === 'comment') {
        break
      }
      node.prop += tokens.shift()[1]
    }

    node.raws.between = ''

    let token
    while (tokens.length) {
      token = tokens.shift()

      if (token[0] === ':') {
        node.raws.between += token[1]
        break
      } else {
        if (token[0] === 'word' && /\w/.test(token[1])) {
          this.unknownWord([token])
        }
        node.raws.between += token[1]
      }
    }

    if (node.prop[0] === '_' || node.prop[0] === '*') {
      node.raws.before += node.prop[0]
      node.prop = node.prop.slice(1)
    }

    let firstSpaces = []
    let next
    while (tokens.length) {
      next = tokens[0][0]
      if (next !== 'space' && next !== 'comment') break
      firstSpaces.push(tokens.shift())
    }

    this.precheckMissedSemicolon(tokens)

    for (let i = tokens.length - 1; i >= 0; i--) {
      token = tokens[i]
      if (token[1].toLowerCase() === '!important') {
        node.important = true
        let string = this.stringFrom(tokens, i)
        string = this.spacesFromEnd(tokens) + string
        if (string !== ' !important') node.raws.important = string
        break
      } else if (token[1].toLowerCase() === 'important') {
        let cache = tokens.slice(0)
        let str = ''
        for (let j = i; j > 0; j--) {
          let type = cache[j][0]
          if (str.trim().indexOf('!') === 0 && type !== 'space') {
            break
          }
          str = cache.pop()[1] + str
        }
        if (str.trim().indexOf('!') === 0) {
          node.important = true
          node.raws.important = str
          tokens = cache
        }
      }

      if (token[0] !== 'space' && token[0] !== 'comment') {
        break
      }
    }

    let hasWord = tokens.some(i => i[0] !== 'space' && i[0] !== 'comment')

    if (hasWord) {
      node.raws.between += firstSpaces.map(i => i[1]).join('')
      firstSpaces = []
    }
    this.raw(node, 'value', firstSpaces.concat(tokens), customProperty)

    if (node.value.includes(':') && !customProperty) {
      this.checkMissedSemicolon(tokens)
    }
  }

  doubleColon(token) {
    throw this.input.error(
      'Double colon',
      { offset: token[2] },
      { offset: token[2] + token[1].length }
    )
  }

  emptyRule(token) {
    let node = new Rule()
    this.init(node, token[2])
    node.selector = ''
    node.raws.between = ''
    this.current = node
  }

  end(token) {
    if (this.current.nodes && this.current.nodes.length) {
      this.current.raws.semicolon = this.semicolon
    }
    this.semicolon = false

    this.current.raws.after = (this.current.raws.after || '') + this.spaces
    this.spaces = ''

    if (this.current.parent) {
      this.current.source.end = this.getPosition(token[2])
      this.current.source.end.offset++
      this.current = this.current.parent
    } else {
      this.unexpectedClose(token)
    }
  }

  endFile() {
    if (this.current.parent) this.unclosedBlock()
    if (this.current.nodes && this.current.nodes.length) {
      this.current.raws.semicolon = this.semicolon
    }
    this.current.raws.after = (this.current.raws.after || '') + this.spaces
    this.root.source.end = this.getPosition(this.tokenizer.position())
  }

  freeSemicolon(token) {
    this.spaces += token[1]
    if (this.current.nodes) {
      let prev = this.current.nodes[this.current.nodes.length - 1]
      if (prev && prev.type === 'rule' && !prev.raws.ownSemicolon) {
        prev.raws.ownSemicolon = this.spaces
        this.spaces = ''
      }
    }
  }

  // Helpers

  getPosition(offset) {
    let pos = this.input.fromOffset(offset)
    return {
      column: pos.col,
      line: pos.line,
      offset
    }
  }

  init(node, offset) {
    this.current.push(node)
    node.source = {
      input: this.input,
      start: this.getPosition(offset)
    }
    node.raws.before = this.spaces
    this.spaces = ''
    if (node.type !== 'comment') this.semicolon = false
  }

  other(start) {
    let end = false
    let type = null
    let colon = false
    let bracket = null
    let brackets = []
    let customProperty = start[1].startsWith('--')

    let tokens = []
    let token = start
    while (token) {
      type = token[0]
      tokens.push(token)

      if (type === '(' || type === '[') {
        if (!bracket) bracket = token
        brackets.push(type === '(' ? ')' : ']')
      } else if (customProperty && colon && type === '{') {
        if (!bracket) bracket = token
        brackets.push('}')
      } else if (brackets.length === 0) {
        if (type === ';') {
          if (colon) {
            this.decl(tokens, customProperty)
            return
          } else {
            break
          }
        } else if (type === '{') {
          this.rule(tokens)
          return
        } else if (type === '}') {
          this.tokenizer.back(tokens.pop())
          end = true
          break
        } else if (type === ':') {
          colon = true
        }
      } else if (type === brackets[brackets.length - 1]) {
        brackets.pop()
        if (brackets.length === 0) bracket = null
      }

      token = this.tokenizer.nextToken()
    }

    if (this.tokenizer.endOfFile()) end = true
    if (brackets.length > 0) this.unclosedBracket(bracket)

    if (end && colon) {
      if (!customProperty) {
        while (tokens.length) {
          token = tokens[tokens.length - 1][0]
          if (token !== 'space' && token !== 'comment') break
          this.tokenizer.back(tokens.pop())
        }
      }
      this.decl(tokens, customProperty)
    } else {
      this.unknownWord(tokens)
    }
  }

  parse() {
    let token
    while (!this.tokenizer.endOfFile()) {
      token = this.tokenizer.nextToken()

      switch (token[0]) {
        case 'space':
          this.spaces += token[1]
          break

        case ';':
          this.freeSemicolon(token)
          break

        case '}':
          this.end(token)
          break

        case 'comment':
          this.comment(token)
          break

        case 'at-word':
          this.atrule(token)
          break

        case '{':
          this.emptyRule(token)
          break

        default:
          this.other(token)
          break
      }
    }
    this.endFile()
  }

  precheckMissedSemicolon(/* tokens */) {
    // Hook for Safe Parser
  }

  raw(node, prop, tokens, customProperty) {
    let token, type
    let length = tokens.length
    let value = ''
    let clean = true
    let next, prev

    for (let i = 0; i < length; i += 1) {
      token = tokens[i]
      type = token[0]
      if (type === 'space' && i === length - 1 && !customProperty) {
        clean = false
      } else if (type === 'comment') {
        prev = tokens[i - 1] ? tokens[i - 1][0] : 'empty'
        next = tokens[i + 1] ? tokens[i + 1][0] : 'empty'
        if (!SAFE_COMMENT_NEIGHBOR[prev] && !SAFE_COMMENT_NEIGHBOR[next]) {
          if (value.slice(-1) === ',') {
            clean = false
          } else {
            value += token[1]
          }
        } else {
          clean = false
        }
      } else {
        value += token[1]
      }
    }
    if (!clean) {
      let raw = tokens.reduce((all, i) => all + i[1], '')
      node.raws[prop] = { raw, value }
    }
    node[prop] = value
  }

  rule(tokens) {
    tokens.pop()

    let node = new Rule()
    this.init(node, tokens[0][2])

    node.raws.between = this.spacesAndCommentsFromEnd(tokens)
    this.raw(node, 'selector', tokens)
    this.current = node
  }

  spacesAndCommentsFromEnd(tokens) {
    let lastTokenType
    let spaces = ''
    while (tokens.length) {
      lastTokenType = tokens[tokens.length - 1][0]
      if (lastTokenType !== 'space' && lastTokenType !== 'comment') break
      spaces = tokens.pop()[1] + spaces
    }
    return spaces
  }

  // Errors

  spacesAndCommentsFromStart(tokens) {
    let next
    let spaces = ''
    while (tokens.length) {
      next = tokens[0][0]
      if (next !== 'space' && next !== 'comment') break
      spaces += tokens.shift()[1]
    }
    return spaces
  }

  spacesFromEnd(tokens) {
    let lastTokenType
    let spaces = ''
    while (tokens.length) {
      lastTokenType = tokens[tokens.length - 1][0]
      if (lastTokenType !== 'space') break
      spaces = tokens.pop()[1] + spaces
    }
    return spaces
  }

  stringFrom(tokens, from) {
    let result = ''
    for (let i = from; i < tokens.length; i++) {
      result += tokens[i][1]
    }
    tokens.splice(from, tokens.length - from)
    return result
  }

  unclosedBlock() {
    let pos = this.current.source.start
    throw this.input.error('Unclosed block', pos.line, pos.column)
  }

  unclosedBracket(bracket) {
    throw this.input.error(
      'Unclosed bracket',
      { offset: bracket[2] },
      { offset: bracket[2] + 1 }
    )
  }

  unexpectedClose(token) {
    throw this.input.error(
      'Unexpected }',
      { offset: token[2] },
      { offset: token[2] + 1 }
    )
  }

  unknownWord(tokens) {
    throw this.input.error(
      'Unknown word',
      { offset: tokens[0][2] },
      { offset: tokens[0][2] + tokens[0][1].length }
    )
  }

  unnamedAtrule(node, token) {
    throw this.input.error(
      'At-rule without name',
      { offset: token[2] },
      { offset: token[2] + token[1].length }
    )
  }
}

module.exports = Parser

},{"./at-rule":13,"./comment":14,"./declaration":17,"./root":32,"./rule":33,"./tokenize":37}],28:[function(require,module,exports){
(function (process){(function (){
'use strict'

let CssSyntaxError = require('./css-syntax-error')
let Declaration = require('./declaration')
let LazyResult = require('./lazy-result')
let Container = require('./container')
let Processor = require('./processor')
let stringify = require('./stringify')
let fromJSON = require('./fromJSON')
let Document = require('./document')
let Warning = require('./warning')
let Comment = require('./comment')
let AtRule = require('./at-rule')
let Result = require('./result.js')
let Input = require('./input')
let parse = require('./parse')
let list = require('./list')
let Rule = require('./rule')
let Root = require('./root')
let Node = require('./node')

function postcss(...plugins) {
  if (plugins.length === 1 && Array.isArray(plugins[0])) {
    plugins = plugins[0]
  }
  return new Processor(plugins)
}

postcss.plugin = function plugin(name, initializer) {
  let warningPrinted = false
  function creator(...args) {
    // eslint-disable-next-line no-console
    if (console && console.warn && !warningPrinted) {
      warningPrinted = true
      // eslint-disable-next-line no-console
      console.warn(
        name +
          ': postcss.plugin was deprecated. Migration guide:\n' +
          'https://evilmartians.com/chronicles/postcss-8-plugin-migration'
      )
      if (process.env.LANG && process.env.LANG.startsWith('cn')) {
        /* c8 ignore next 7 */
        // eslint-disable-next-line no-console
        console.warn(
          name +
            ': 里面 postcss.plugin 被弃用. 迁移指南:\n' +
            'https://www.w3ctech.com/topic/2226'
        )
      }
    }
    let transformer = initializer(...args)
    transformer.postcssPlugin = name
    transformer.postcssVersion = new Processor().version
    return transformer
  }

  let cache
  Object.defineProperty(creator, 'postcss', {
    get() {
      if (!cache) cache = creator()
      return cache
    }
  })

  creator.process = function (css, processOpts, pluginOpts) {
    return postcss([creator(pluginOpts)]).process(css, processOpts)
  }

  return creator
}

postcss.stringify = stringify
postcss.parse = parse
postcss.fromJSON = fromJSON
postcss.list = list

postcss.comment = defaults => new Comment(defaults)
postcss.atRule = defaults => new AtRule(defaults)
postcss.decl = defaults => new Declaration(defaults)
postcss.rule = defaults => new Rule(defaults)
postcss.root = defaults => new Root(defaults)
postcss.document = defaults => new Document(defaults)

postcss.CssSyntaxError = CssSyntaxError
postcss.Declaration = Declaration
postcss.Container = Container
postcss.Processor = Processor
postcss.Document = Document
postcss.Comment = Comment
postcss.Warning = Warning
postcss.AtRule = AtRule
postcss.Result = Result
postcss.Input = Input
postcss.Rule = Rule
postcss.Root = Root
postcss.Node = Node

LazyResult.registerPostcss(postcss)

module.exports = postcss
postcss.default = postcss

}).call(this)}).call(this,require('_process'))
},{"./at-rule":13,"./comment":14,"./container":15,"./css-syntax-error":16,"./declaration":17,"./document":18,"./fromJSON":19,"./input":20,"./lazy-result":21,"./list":22,"./node":25,"./parse":26,"./processor":30,"./result.js":31,"./root":32,"./rule":33,"./stringify":35,"./warning":39,"_process":40}],29:[function(require,module,exports){
(function (Buffer){(function (){
'use strict'

let { SourceMapConsumer, SourceMapGenerator } = require('source-map-js')
let { existsSync, readFileSync } = require('fs')
let { dirname, join } = require('path')

function fromBase64(str) {
  if (Buffer) {
    return Buffer.from(str, 'base64').toString()
  } else {
    /* c8 ignore next 2 */
    return window.atob(str)
  }
}

class PreviousMap {
  constructor(css, opts) {
    if (opts.map === false) return
    this.loadAnnotation(css)
    this.inline = this.startWith(this.annotation, 'data:')

    let prev = opts.map ? opts.map.prev : undefined
    let text = this.loadMap(opts.from, prev)
    if (!this.mapFile && opts.from) {
      this.mapFile = opts.from
    }
    if (this.mapFile) this.root = dirname(this.mapFile)
    if (text) this.text = text
  }

  consumer() {
    if (!this.consumerCache) {
      this.consumerCache = new SourceMapConsumer(this.text)
    }
    return this.consumerCache
  }

  decodeInline(text) {
    let baseCharsetUri = /^data:application\/json;charset=utf-?8;base64,/
    let baseUri = /^data:application\/json;base64,/
    let charsetUri = /^data:application\/json;charset=utf-?8,/
    let uri = /^data:application\/json,/

    if (charsetUri.test(text) || uri.test(text)) {
      return decodeURIComponent(text.substr(RegExp.lastMatch.length))
    }

    if (baseCharsetUri.test(text) || baseUri.test(text)) {
      return fromBase64(text.substr(RegExp.lastMatch.length))
    }

    let encoding = text.match(/data:application\/json;([^,]+),/)[1]
    throw new Error('Unsupported source map encoding ' + encoding)
  }

  getAnnotationURL(sourceMapString) {
    return sourceMapString.replace(/^\/\*\s*# sourceMappingURL=/, '').trim()
  }

  isMap(map) {
    if (typeof map !== 'object') return false
    return (
      typeof map.mappings === 'string' ||
      typeof map._mappings === 'string' ||
      Array.isArray(map.sections)
    )
  }

  loadAnnotation(css) {
    let comments = css.match(/\/\*\s*# sourceMappingURL=/gm)
    if (!comments) return

    // sourceMappingURLs from comments, strings, etc.
    let start = css.lastIndexOf(comments.pop())
    let end = css.indexOf('*/', start)

    if (start > -1 && end > -1) {
      // Locate the last sourceMappingURL to avoid pickin
      this.annotation = this.getAnnotationURL(css.substring(start, end))
    }
  }

  loadFile(path) {
    this.root = dirname(path)
    if (existsSync(path)) {
      this.mapFile = path
      return readFileSync(path, 'utf-8').toString().trim()
    }
  }

  loadMap(file, prev) {
    if (prev === false) return false

    if (prev) {
      if (typeof prev === 'string') {
        return prev
      } else if (typeof prev === 'function') {
        let prevPath = prev(file)
        if (prevPath) {
          let map = this.loadFile(prevPath)
          if (!map) {
            throw new Error(
              'Unable to load previous source map: ' + prevPath.toString()
            )
          }
          return map
        }
      } else if (prev instanceof SourceMapConsumer) {
        return SourceMapGenerator.fromSourceMap(prev).toString()
      } else if (prev instanceof SourceMapGenerator) {
        return prev.toString()
      } else if (this.isMap(prev)) {
        return JSON.stringify(prev)
      } else {
        throw new Error(
          'Unsupported previous source map format: ' + prev.toString()
        )
      }
    } else if (this.inline) {
      return this.decodeInline(this.annotation)
    } else if (this.annotation) {
      let map = this.annotation
      if (file) map = join(dirname(file), map)
      return this.loadFile(map)
    }
  }

  startWith(string, start) {
    if (!string) return false
    return string.substr(0, start.length) === start
  }

  withContent() {
    return !!(
      this.consumer().sourcesContent &&
      this.consumer().sourcesContent.length > 0
    )
  }
}

module.exports = PreviousMap
PreviousMap.default = PreviousMap

}).call(this)}).call(this,require("buffer").Buffer)
},{"buffer":7,"fs":6,"path":6,"source-map-js":6}],30:[function(require,module,exports){
(function (process){(function (){
'use strict'

let NoWorkResult = require('./no-work-result')
let LazyResult = require('./lazy-result')
let Document = require('./document')
let Root = require('./root')

class Processor {
  constructor(plugins = []) {
    this.version = '8.4.32'
    this.plugins = this.normalize(plugins)
  }

  normalize(plugins) {
    let normalized = []
    for (let i of plugins) {
      if (i.postcss === true) {
        i = i()
      } else if (i.postcss) {
        i = i.postcss
      }

      if (typeof i === 'object' && Array.isArray(i.plugins)) {
        normalized = normalized.concat(i.plugins)
      } else if (typeof i === 'object' && i.postcssPlugin) {
        normalized.push(i)
      } else if (typeof i === 'function') {
        normalized.push(i)
      } else if (typeof i === 'object' && (i.parse || i.stringify)) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error(
            'PostCSS syntaxes cannot be used as plugins. Instead, please use ' +
              'one of the syntax/parser/stringifier options as outlined ' +
              'in your PostCSS runner documentation.'
          )
        }
      } else {
        throw new Error(i + ' is not a PostCSS plugin')
      }
    }
    return normalized
  }

  process(css, opts = {}) {
    if (
      this.plugins.length === 0 &&
      typeof opts.parser === 'undefined' &&
      typeof opts.stringifier === 'undefined' &&
      typeof opts.syntax === 'undefined'
    ) {
      return new NoWorkResult(this, css, opts)
    } else {
      return new LazyResult(this, css, opts)
    }
  }

  use(plugin) {
    this.plugins = this.plugins.concat(this.normalize([plugin]))
    return this
  }
}

module.exports = Processor
Processor.default = Processor

Root.registerProcessor(Processor)
Document.registerProcessor(Processor)

}).call(this)}).call(this,require('_process'))
},{"./document":18,"./lazy-result":21,"./no-work-result":24,"./root":32,"_process":40}],31:[function(require,module,exports){
'use strict'

let Warning = require('./warning')

class Result {
  constructor(processor, root, opts) {
    this.processor = processor
    this.messages = []
    this.root = root
    this.opts = opts
    this.css = undefined
    this.map = undefined
  }

  toString() {
    return this.css
  }

  warn(text, opts = {}) {
    if (!opts.plugin) {
      if (this.lastPlugin && this.lastPlugin.postcssPlugin) {
        opts.plugin = this.lastPlugin.postcssPlugin
      }
    }

    let warning = new Warning(text, opts)
    this.messages.push(warning)

    return warning
  }

  warnings() {
    return this.messages.filter(i => i.type === 'warning')
  }

  get content() {
    return this.css
  }
}

module.exports = Result
Result.default = Result

},{"./warning":39}],32:[function(require,module,exports){
'use strict'

let Container = require('./container')

let LazyResult, Processor

class Root extends Container {
  constructor(defaults) {
    super(defaults)
    this.type = 'root'
    if (!this.nodes) this.nodes = []
  }

  normalize(child, sample, type) {
    let nodes = super.normalize(child)

    if (sample) {
      if (type === 'prepend') {
        if (this.nodes.length > 1) {
          sample.raws.before = this.nodes[1].raws.before
        } else {
          delete sample.raws.before
        }
      } else if (this.first !== sample) {
        for (let node of nodes) {
          node.raws.before = sample.raws.before
        }
      }
    }

    return nodes
  }

  removeChild(child, ignore) {
    let index = this.index(child)

    if (!ignore && index === 0 && this.nodes.length > 1) {
      this.nodes[1].raws.before = this.nodes[index].raws.before
    }

    return super.removeChild(child)
  }

  toResult(opts = {}) {
    let lazy = new LazyResult(new Processor(), this, opts)
    return lazy.stringify()
  }
}

Root.registerLazyResult = dependant => {
  LazyResult = dependant
}

Root.registerProcessor = dependant => {
  Processor = dependant
}

module.exports = Root
Root.default = Root

Container.registerRoot(Root)

},{"./container":15}],33:[function(require,module,exports){
'use strict'

let Container = require('./container')
let list = require('./list')

class Rule extends Container {
  constructor(defaults) {
    super(defaults)
    this.type = 'rule'
    if (!this.nodes) this.nodes = []
  }

  get selectors() {
    return list.comma(this.selector)
  }

  set selectors(values) {
    let match = this.selector ? this.selector.match(/,\s*/) : null
    let sep = match ? match[0] : ',' + this.raw('between', 'beforeOpen')
    this.selector = values.join(sep)
  }
}

module.exports = Rule
Rule.default = Rule

Container.registerRule(Rule)

},{"./container":15,"./list":22}],34:[function(require,module,exports){
'use strict'

const DEFAULT_RAW = {
  after: '\n',
  beforeClose: '\n',
  beforeComment: '\n',
  beforeDecl: '\n',
  beforeOpen: ' ',
  beforeRule: '\n',
  colon: ': ',
  commentLeft: ' ',
  commentRight: ' ',
  emptyBody: '',
  indent: '    ',
  semicolon: false
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1)
}

class Stringifier {
  constructor(builder) {
    this.builder = builder
  }

  atrule(node, semicolon) {
    let name = '@' + node.name
    let params = node.params ? this.rawValue(node, 'params') : ''

    if (typeof node.raws.afterName !== 'undefined') {
      name += node.raws.afterName
    } else if (params) {
      name += ' '
    }

    if (node.nodes) {
      this.block(node, name + params)
    } else {
      let end = (node.raws.between || '') + (semicolon ? ';' : '')
      this.builder(name + params + end, node)
    }
  }

  beforeAfter(node, detect) {
    let value
    if (node.type === 'decl') {
      value = this.raw(node, null, 'beforeDecl')
    } else if (node.type === 'comment') {
      value = this.raw(node, null, 'beforeComment')
    } else if (detect === 'before') {
      value = this.raw(node, null, 'beforeRule')
    } else {
      value = this.raw(node, null, 'beforeClose')
    }

    let buf = node.parent
    let depth = 0
    while (buf && buf.type !== 'root') {
      depth += 1
      buf = buf.parent
    }

    if (value.includes('\n')) {
      let indent = this.raw(node, null, 'indent')
      if (indent.length) {
        for (let step = 0; step < depth; step++) value += indent
      }
    }

    return value
  }

  block(node, start) {
    let between = this.raw(node, 'between', 'beforeOpen')
    this.builder(start + between + '{', node, 'start')

    let after
    if (node.nodes && node.nodes.length) {
      this.body(node)
      after = this.raw(node, 'after')
    } else {
      after = this.raw(node, 'after', 'emptyBody')
    }

    if (after) this.builder(after)
    this.builder('}', node, 'end')
  }

  body(node) {
    let last = node.nodes.length - 1
    while (last > 0) {
      if (node.nodes[last].type !== 'comment') break
      last -= 1
    }

    let semicolon = this.raw(node, 'semicolon')
    for (let i = 0; i < node.nodes.length; i++) {
      let child = node.nodes[i]
      let before = this.raw(child, 'before')
      if (before) this.builder(before)
      this.stringify(child, last !== i || semicolon)
    }
  }

  comment(node) {
    let left = this.raw(node, 'left', 'commentLeft')
    let right = this.raw(node, 'right', 'commentRight')
    this.builder('/*' + left + node.text + right + '*/', node)
  }

  decl(node, semicolon) {
    let between = this.raw(node, 'between', 'colon')
    let string = node.prop + between + this.rawValue(node, 'value')

    if (node.important) {
      string += node.raws.important || ' !important'
    }

    if (semicolon) string += ';'
    this.builder(string, node)
  }

  document(node) {
    this.body(node)
  }

  raw(node, own, detect) {
    let value
    if (!detect) detect = own

    // Already had
    if (own) {
      value = node.raws[own]
      if (typeof value !== 'undefined') return value
    }

    let parent = node.parent

    if (detect === 'before') {
      // Hack for first rule in CSS
      if (!parent || (parent.type === 'root' && parent.first === node)) {
        return ''
      }

      // `root` nodes in `document` should use only their own raws
      if (parent && parent.type === 'document') {
        return ''
      }
    }

    // Floating child without parent
    if (!parent) return DEFAULT_RAW[detect]

    // Detect style by other nodes
    let root = node.root()
    if (!root.rawCache) root.rawCache = {}
    if (typeof root.rawCache[detect] !== 'undefined') {
      return root.rawCache[detect]
    }

    if (detect === 'before' || detect === 'after') {
      return this.beforeAfter(node, detect)
    } else {
      let method = 'raw' + capitalize(detect)
      if (this[method]) {
        value = this[method](root, node)
      } else {
        root.walk(i => {
          value = i.raws[own]
          if (typeof value !== 'undefined') return false
        })
      }
    }

    if (typeof value === 'undefined') value = DEFAULT_RAW[detect]

    root.rawCache[detect] = value
    return value
  }

  rawBeforeClose(root) {
    let value
    root.walk(i => {
      if (i.nodes && i.nodes.length > 0) {
        if (typeof i.raws.after !== 'undefined') {
          value = i.raws.after
          if (value.includes('\n')) {
            value = value.replace(/[^\n]+$/, '')
          }
          return false
        }
      }
    })
    if (value) value = value.replace(/\S/g, '')
    return value
  }

  rawBeforeComment(root, node) {
    let value
    root.walkComments(i => {
      if (typeof i.raws.before !== 'undefined') {
        value = i.raws.before
        if (value.includes('\n')) {
          value = value.replace(/[^\n]+$/, '')
        }
        return false
      }
    })
    if (typeof value === 'undefined') {
      value = this.raw(node, null, 'beforeDecl')
    } else if (value) {
      value = value.replace(/\S/g, '')
    }
    return value
  }

  rawBeforeDecl(root, node) {
    let value
    root.walkDecls(i => {
      if (typeof i.raws.before !== 'undefined') {
        value = i.raws.before
        if (value.includes('\n')) {
          value = value.replace(/[^\n]+$/, '')
        }
        return false
      }
    })
    if (typeof value === 'undefined') {
      value = this.raw(node, null, 'beforeRule')
    } else if (value) {
      value = value.replace(/\S/g, '')
    }
    return value
  }

  rawBeforeOpen(root) {
    let value
    root.walk(i => {
      if (i.type !== 'decl') {
        value = i.raws.between
        if (typeof value !== 'undefined') return false
      }
    })
    return value
  }

  rawBeforeRule(root) {
    let value
    root.walk(i => {
      if (i.nodes && (i.parent !== root || root.first !== i)) {
        if (typeof i.raws.before !== 'undefined') {
          value = i.raws.before
          if (value.includes('\n')) {
            value = value.replace(/[^\n]+$/, '')
          }
          return false
        }
      }
    })
    if (value) value = value.replace(/\S/g, '')
    return value
  }

  rawColon(root) {
    let value
    root.walkDecls(i => {
      if (typeof i.raws.between !== 'undefined') {
        value = i.raws.between.replace(/[^\s:]/g, '')
        return false
      }
    })
    return value
  }

  rawEmptyBody(root) {
    let value
    root.walk(i => {
      if (i.nodes && i.nodes.length === 0) {
        value = i.raws.after
        if (typeof value !== 'undefined') return false
      }
    })
    return value
  }

  rawIndent(root) {
    if (root.raws.indent) return root.raws.indent
    let value
    root.walk(i => {
      let p = i.parent
      if (p && p !== root && p.parent && p.parent === root) {
        if (typeof i.raws.before !== 'undefined') {
          let parts = i.raws.before.split('\n')
          value = parts[parts.length - 1]
          value = value.replace(/\S/g, '')
          return false
        }
      }
    })
    return value
  }

  rawSemicolon(root) {
    let value
    root.walk(i => {
      if (i.nodes && i.nodes.length && i.last.type === 'decl') {
        value = i.raws.semicolon
        if (typeof value !== 'undefined') return false
      }
    })
    return value
  }

  rawValue(node, prop) {
    let value = node[prop]
    let raw = node.raws[prop]
    if (raw && raw.value === value) {
      return raw.raw
    }

    return value
  }

  root(node) {
    this.body(node)
    if (node.raws.after) this.builder(node.raws.after)
  }

  rule(node) {
    this.block(node, this.rawValue(node, 'selector'))
    if (node.raws.ownSemicolon) {
      this.builder(node.raws.ownSemicolon, node, 'end')
    }
  }

  stringify(node, semicolon) {
    /* c8 ignore start */
    if (!this[node.type]) {
      throw new Error(
        'Unknown AST node type ' +
          node.type +
          '. ' +
          'Maybe you need to change PostCSS stringifier.'
      )
    }
    /* c8 ignore stop */
    this[node.type](node, semicolon)
  }
}

module.exports = Stringifier
Stringifier.default = Stringifier

},{}],35:[function(require,module,exports){
'use strict'

let Stringifier = require('./stringifier')

function stringify(node, builder) {
  let str = new Stringifier(builder)
  str.stringify(node)
}

module.exports = stringify
stringify.default = stringify

},{"./stringifier":34}],36:[function(require,module,exports){
'use strict'

module.exports.isClean = Symbol('isClean')

module.exports.my = Symbol('my')

},{}],37:[function(require,module,exports){
'use strict'

const SINGLE_QUOTE = "'".charCodeAt(0)
const DOUBLE_QUOTE = '"'.charCodeAt(0)
const BACKSLASH = '\\'.charCodeAt(0)
const SLASH = '/'.charCodeAt(0)
const NEWLINE = '\n'.charCodeAt(0)
const SPACE = ' '.charCodeAt(0)
const FEED = '\f'.charCodeAt(0)
const TAB = '\t'.charCodeAt(0)
const CR = '\r'.charCodeAt(0)
const OPEN_SQUARE = '['.charCodeAt(0)
const CLOSE_SQUARE = ']'.charCodeAt(0)
const OPEN_PARENTHESES = '('.charCodeAt(0)
const CLOSE_PARENTHESES = ')'.charCodeAt(0)
const OPEN_CURLY = '{'.charCodeAt(0)
const CLOSE_CURLY = '}'.charCodeAt(0)
const SEMICOLON = ';'.charCodeAt(0)
const ASTERISK = '*'.charCodeAt(0)
const COLON = ':'.charCodeAt(0)
const AT = '@'.charCodeAt(0)

const RE_AT_END = /[\t\n\f\r "#'()/;[\\\]{}]/g
const RE_WORD_END = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g
const RE_BAD_BRACKET = /.[\r\n"'(/\\]/
const RE_HEX_ESCAPE = /[\da-f]/i

module.exports = function tokenizer(input, options = {}) {
  let css = input.css.valueOf()
  let ignore = options.ignoreErrors

  let code, next, quote, content, escape
  let escaped, escapePos, prev, n, currentToken

  let length = css.length
  let pos = 0
  let buffer = []
  let returned = []

  function position() {
    return pos
  }

  function unclosed(what) {
    throw input.error('Unclosed ' + what, pos)
  }

  function endOfFile() {
    return returned.length === 0 && pos >= length
  }

  function nextToken(opts) {
    if (returned.length) return returned.pop()
    if (pos >= length) return

    let ignoreUnclosed = opts ? opts.ignoreUnclosed : false

    code = css.charCodeAt(pos)

    switch (code) {
      case NEWLINE:
      case SPACE:
      case TAB:
      case CR:
      case FEED: {
        next = pos
        do {
          next += 1
          code = css.charCodeAt(next)
        } while (
          code === SPACE ||
          code === NEWLINE ||
          code === TAB ||
          code === CR ||
          code === FEED
        )

        currentToken = ['space', css.slice(pos, next)]
        pos = next - 1
        break
      }

      case OPEN_SQUARE:
      case CLOSE_SQUARE:
      case OPEN_CURLY:
      case CLOSE_CURLY:
      case COLON:
      case SEMICOLON:
      case CLOSE_PARENTHESES: {
        let controlChar = String.fromCharCode(code)
        currentToken = [controlChar, controlChar, pos]
        break
      }

      case OPEN_PARENTHESES: {
        prev = buffer.length ? buffer.pop()[1] : ''
        n = css.charCodeAt(pos + 1)
        if (
          prev === 'url' &&
          n !== SINGLE_QUOTE &&
          n !== DOUBLE_QUOTE &&
          n !== SPACE &&
          n !== NEWLINE &&
          n !== TAB &&
          n !== FEED &&
          n !== CR
        ) {
          next = pos
          do {
            escaped = false
            next = css.indexOf(')', next + 1)
            if (next === -1) {
              if (ignore || ignoreUnclosed) {
                next = pos
                break
              } else {
                unclosed('bracket')
              }
            }
            escapePos = next
            while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
              escapePos -= 1
              escaped = !escaped
            }
          } while (escaped)

          currentToken = ['brackets', css.slice(pos, next + 1), pos, next]

          pos = next
        } else {
          next = css.indexOf(')', pos + 1)
          content = css.slice(pos, next + 1)

          if (next === -1 || RE_BAD_BRACKET.test(content)) {
            currentToken = ['(', '(', pos]
          } else {
            currentToken = ['brackets', content, pos, next]
            pos = next
          }
        }

        break
      }

      case SINGLE_QUOTE:
      case DOUBLE_QUOTE: {
        quote = code === SINGLE_QUOTE ? "'" : '"'
        next = pos
        do {
          escaped = false
          next = css.indexOf(quote, next + 1)
          if (next === -1) {
            if (ignore || ignoreUnclosed) {
              next = pos + 1
              break
            } else {
              unclosed('string')
            }
          }
          escapePos = next
          while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
            escapePos -= 1
            escaped = !escaped
          }
        } while (escaped)

        currentToken = ['string', css.slice(pos, next + 1), pos, next]
        pos = next
        break
      }

      case AT: {
        RE_AT_END.lastIndex = pos + 1
        RE_AT_END.test(css)
        if (RE_AT_END.lastIndex === 0) {
          next = css.length - 1
        } else {
          next = RE_AT_END.lastIndex - 2
        }

        currentToken = ['at-word', css.slice(pos, next + 1), pos, next]

        pos = next
        break
      }

      case BACKSLASH: {
        next = pos
        escape = true
        while (css.charCodeAt(next + 1) === BACKSLASH) {
          next += 1
          escape = !escape
        }
        code = css.charCodeAt(next + 1)
        if (
          escape &&
          code !== SLASH &&
          code !== SPACE &&
          code !== NEWLINE &&
          code !== TAB &&
          code !== CR &&
          code !== FEED
        ) {
          next += 1
          if (RE_HEX_ESCAPE.test(css.charAt(next))) {
            while (RE_HEX_ESCAPE.test(css.charAt(next + 1))) {
              next += 1
            }
            if (css.charCodeAt(next + 1) === SPACE) {
              next += 1
            }
          }
        }

        currentToken = ['word', css.slice(pos, next + 1), pos, next]

        pos = next
        break
      }

      default: {
        if (code === SLASH && css.charCodeAt(pos + 1) === ASTERISK) {
          next = css.indexOf('*/', pos + 2) + 1
          if (next === 0) {
            if (ignore || ignoreUnclosed) {
              next = css.length
            } else {
              unclosed('comment')
            }
          }

          currentToken = ['comment', css.slice(pos, next + 1), pos, next]
          pos = next
        } else {
          RE_WORD_END.lastIndex = pos + 1
          RE_WORD_END.test(css)
          if (RE_WORD_END.lastIndex === 0) {
            next = css.length - 1
          } else {
            next = RE_WORD_END.lastIndex - 2
          }

          currentToken = ['word', css.slice(pos, next + 1), pos, next]
          buffer.push(currentToken)
          pos = next
        }

        break
      }
    }

    pos++
    return currentToken
  }

  function back(token) {
    returned.push(token)
  }

  return {
    back,
    endOfFile,
    nextToken,
    position
  }
}

},{}],38:[function(require,module,exports){
/* eslint-disable no-console */
'use strict'

let printed = {}

module.exports = function warnOnce(message) {
  if (printed[message]) return
  printed[message] = true

  if (typeof console !== 'undefined' && console.warn) {
    console.warn(message)
  }
}

},{}],39:[function(require,module,exports){
'use strict'

class Warning {
  constructor(text, opts = {}) {
    this.type = 'warning'
    this.text = text

    if (opts.node && opts.node.source) {
      let range = opts.node.rangeBy(opts)
      this.line = range.start.line
      this.column = range.start.column
      this.endLine = range.end.line
      this.endColumn = range.end.column
    }

    for (let opt in opts) this[opt] = opts[opt]
  }

  toString() {
    if (this.node) {
      return this.node.error(this.text, {
        index: this.index,
        plugin: this.plugin,
        word: this.word
      }).message
    }

    if (this.plugin) {
      return this.plugin + ': ' + this.text
    }

    return this.text
  }
}

module.exports = Warning
Warning.default = Warning

},{}],40:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],41:[function(require,module,exports){
/**
 *
 * Convert this file using browserify
 *
 */
const processor = require('postcss');
const customMedia = require('postcss-custom-media');
const mediaMinMax = require('postcss-media-minmax');

(async function () {
    const stylesFile = requirejs.toUrl('css/styles.css');
    const response = await fetch(stylesFile);
    let styles = await response.text();
    const imports = await retrieveImports(styles);
    styles = removeImports(styles);
    styles = imports.join('\n') + styles;
    styles = runPostCss(styles);
    inlineStyle(styles);
})();

function runPostCss(styles) {
    return processor([
        customMedia,
        mediaMinMax
    ]).process(styles).css;
}

function inlineStyle(styles) {
    const head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
    head.appendChild(style);
    style.appendChild(document.createTextNode(styles));
}

async function retrieveImports(styles) {
    const matches = styles.matchAll(/@import\s+['|"](.+\.css)['|"]/g);
    const imports = Array.from(matches).map(match => {
        return fetchCssFile(requirejs.toUrl('css/') + match[1]);
    });
    return Promise.all(imports);
}

async function fetchCssFile(file) {
    const response = await fetch(file);
    return await response.text();
}

function removeImports(styles) {
    return styles.replace(/@import\s+['|"](.+\.css)['|"];/gm, "");
}

},{"postcss":28,"postcss-custom-media":11,"postcss-media-minmax":12}]},{},[41]);
