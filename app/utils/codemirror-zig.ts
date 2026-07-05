import { StreamLanguage } from "@codemirror/language";
import type { StreamParser } from "@codemirror/language";
import {
  autocompletion,
  type CompletionContext,
  type Completion,
} from "@codemirror/autocomplete";

const keywords = new Set([
  "addrspace",
  "align",
  "allowzero",
  "and",
  "anyframe",
  "anytype",
  "asm",
  "async",
  "await",
  "break",
  "catch",
  "comptime",
  "const",
  "continue",
  "defer",
  "else",
  "enum",
  "errdefer",
  "error",
  "export",
  "extern",
  "fn",
  "for",
  "if",
  "inline",
  "noalias",
  "nosuspend",
  "opaque",
  "or",
  "orelse",
  "packed",
  "pub",
  "resume",
  "return",
  "linksection",
  "struct",
  "suspend",
  "switch",
  "test",
  "threadlocal",
  "try",
  "unreachable",
  "union",
  "usingnamespace",
  "var",
  "volatile",
  "while",
]);

const types = new Set([
  "anyerror",
  "anyframe",
  "anyopaque",
  "bool",
  "c_char",
  "c_short",
  "c_ushort",
  "c_int",
  "c_uint",
  "c_long",
  "c_ulong",
  "c_longlong",
  "c_ulonglong",
  "c_longdouble",
  "f16",
  "f32",
  "f64",
  "f128",
  "i8",
  "i16",
  "i32",
  "i64",
  "i128",
  "isize",
  "noreturn",
  "type",
  "u8",
  "u16",
  "u32",
  "u64",
  "u128",
  "usize",
  "void",
]);

const builtins = new Set([
  "addrSpaceCast",
  "addWithOverflow",
  "alignCast",
  "alignOf",
  "as",
  "atomicLoad",
  "atomicRmw",
  "atomicStore",
  "bitCast",
  "bitOffsetOf",
  "boolToInt",
  "branchHint",
  "bswap",
  "bitSizeOf",
  "bytesToSlice",
  "cDefine",
  "cImport",
  "cInclude",
  "clz",
  "cmpxchgStrong",
  "cmpxchgWeak",
  "compileError",
  "compileLog",
  "constCast",
  "ctz",
  "cUndef",
  "divExact",
  "divFloor",
  "divTrunc",
  "embedFile",
  "enumFromInt",
  "errorFromInt",
  "errorName",
  "errorReturnTrace",
  "errorCast",
  "extern",
  "fence",
  "field",
  "fieldParentPtr",
  "floatFromInt",
  "frameAddress",
  "hasDecl",
  "hasField",
  "import",
  "inComptime",
  "intFromBool",
  "intFromEnum",
  "intFromError",
  "intFromFloat",
  "intFromPtr",
  "max",
  "memcpy",
  "memset",
  "min",
  "mod",
  "mulAdd",
  "mulWithOverflow",
  "offsetOf",
  "panic",
  "popCount",
  "prefetch",
  "ptrCast",
  "ptrFromInt",
  "rem",
  "returnAddress",
  "round",
  "select",
  "setAlignStack",
  "setCold",
  "setEvalBranchQuota",
  "setFloatMode",
  "setRuntimeSafety",
  "shlExact",
  "shlWithOverflow",
  "shrExact",
  "shuffle",
  "sliceToBytes",
  "splat",
  "sqrt",
  "sin",
  "cos",
  "tan",
  "exp",
  "exp2",
  "log",
  "log2",
  "log10",
  "fabs",
  "floor",
  "ceil",
  "trunc",
  "wasmMemorySize",
  "wasmMemoryGrow",
  "src",
  "subWithOverflow",
  "tagName",
  "This",
  "truncate",
  "Type",
  "typeInfo",
  "typeName",
  "unionInit",
  "Vector",
  "volatileCast",
  "xor",
]);

function isDigit(ch: string) {
  return /\d/.test(ch);
}

function isHex(ch: string) {
  return /[0-9a-fA-F]/.test(ch);
}

function isBin(ch: string) {
  return ch === "0" || ch === "1";
}

function isOct(ch: string) {
  return /[0-7]/.test(ch);
}

function isIdentifierStart(ch: string) {
  return /[a-zA-Z_]/.test(ch);
}

function isIdentifierChar(ch: string) {
  return /[a-zA-Z0-9_]/.test(ch);
}

const zigParser: StreamParser<unknown> = {
  startState: () => ({}),
  token(stream, _state) {
    if (stream.eatSpace()) {
      return null;
    }

    const ch = stream.peek();
    if (ch === null) {
      return null;
    }

    // Comments
    if (ch === "/") {
      stream.next();
      if (stream.eat("/")) {
        stream.skipToEnd();
        return "comment";
      }
      if (stream.eat("*")) {
        // Multiline comments (rare in Zig, but support them)
        while (!stream.eol()) {
          if (stream.next() === "*" && stream.eat("/")) break;
        }
        return "comment";
      }
      if (stream.eat("=")) {
        return "operator";
      }
      return "operator";
    }

    // Strings
    if (ch === '"') {
      stream.next();
      while (!stream.eol()) {
        const c = stream.next();
        if (c === "\\") {
          stream.next();
        } else if (c === '"') {
          break;
        }
      }
      return "string";
    }

    if (ch === "'") {
      stream.next();
      while (!stream.eol()) {
        const c = stream.next();
        if (c === "\\") {
          stream.next();
        } else if (c === "'") {
          break;
        }
      }
      return "string";
    }

    // Numbers
    if (isDigit(ch)) {
      stream.next();
      if (stream.match("0x", false)) {
        stream.match("0x");
        while (isHex(stream.peek() || "")) stream.next();
      } else if (stream.match("0b", false)) {
        stream.match("0b");
        while (isBin(stream.peek() || "")) stream.next();
      } else if (stream.match("0o", false)) {
        stream.match("0o");
        while (isOct(stream.peek() || "")) stream.next();
      } else {
        while (isDigit(stream.peek() || "")) stream.next();
      }
      if (stream.eat(".") && isDigit(stream.peek() || "")) {
        while (isDigit(stream.peek() || "")) stream.next();
      }
      if (stream.eat(/[eE]/)) {
        stream.eat(/[+\-]/);
        while (isDigit(stream.peek() || "")) stream.next();
      }
      return "number";
    }

    // Identifiers and keywords
    if (isIdentifierStart(ch)) {
      stream.next();
      while (isIdentifierChar(stream.peek() || "")) stream.next();
      const word = stream.current();
      if (keywords.has(word)) return "keyword";
      if (types.has(word)) return "typeName";
      return "variable";
    }

    // Builtins: @import, @intCast, etc.
    if (ch === "@") {
      stream.next();
      while (isIdentifierChar(stream.peek() || "")) stream.next();
      const word = stream.current().slice(1);
      if (builtins.has(word)) return "builtin";
      return "variable";
    }

    // Operators and punctuation
    if (/[+\-*/%=<>&|^~.]/.test(ch)) {
      stream.next();
      const next = stream.peek() || "";
      if (ch === "." && (next === "*" || next === "?")) {
        stream.next();
        return "operator";
      }
      const two = ch + next;
      if (/[+\-*/%=<>&|^]=|<<|>>|&&|\|\|=>|==|!=|<=|>=|\+\+|\*\*/.test(two)) {
        stream.next();
      }
      return "operator";
    }

    if (/[{}()\[\];:,.]/.test(ch)) {
      stream.next();
      return "punctuation";
    }

    // Unknown characters
    stream.next();
    return null;
  },
};

export const zigLanguage = StreamLanguage.define(zigParser);

const keywordCompletions: Completion[] = Array.from(keywords).map((k) => ({
  label: k,
  type: "keyword",
  boost: 5,
}));

const typeCompletions: Completion[] = Array.from(types).map((t) => ({
  label: t,
  type: "type",
  boost: 3,
}));

const builtinCompletions: Completion[] = Array.from(builtins).map((b) => ({
  label: "@" + b,
  type: "function",
  boost: 2,
}));

const allCompletions = [
  ...keywordCompletions,
  ...typeCompletions,
  ...builtinCompletions,
];

function zigCompletion(context: CompletionContext) {
  const word = context.matchBefore(/[@a-zA-Z_][a-zA-Z0-9_]*/);
  if (!word || (word.from === word.to && !context.explicit)) {
    return null;
  }

  const text = word.text.toLowerCase();
  const options = allCompletions
    .filter((opt) => opt.label.toLowerCase().startsWith(text))
    .sort((a, b) => (b.boost || 0) - (a.boost || 0));

  if (options.length === 0) return null;

  return {
    from: word.from,
    options,
  };
}

export const zigAutocomplete = autocompletion({
  override: [zigCompletion],
  defaultKeymap: true,
});

