/**
 * Safe Math Evaluator - NO eval() or new Function()
 * ✅ XSS-proof: Pure recursive descent parser
 * ✅ Supports: +, -, *, /, %, **, (), sqrt, pow, sin, cos, tan, log, abs, round, ceil, floor, max, min
 * ✅ Constants: PI, E
 */

export const MathEval = {
  // Math context - only safe methods
  ctx: {
    PI: Math.PI,
    E: Math.E,
    sqrt: Math.sqrt,
    pow: Math.pow,
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    log: Math.log,
    abs: Math.abs,
    round: Math.round,
    ceil: Math.ceil,
    floor: Math.floor,
    max: Math.max,
    min: Math.min,
  },

  // Tokenize expression
  tokenize(expr) {
    const tokens = [];
    let current = '';
    
    for(let char of expr) {
      if(/[\d.]/.test(char) || /[a-zA-Z_]/.test(char)) {
        current += char;
      } else {
        if(current) tokens.push(current);
        if(!/\s/.test(char)) tokens.push(char);
        current = '';
      }
    }
    if(current) tokens.push(current);
    return tokens;
  },

  // Validate token is safe
  isValidToken(token) {
    if(/^\d+\.?\d*$/.test(token)) return true;
    if(token in this.ctx) return true;
    if('+-*/%(),'.includes(token)) return true;
    return false;
  },

  /**
   * Pure recursive descent parser — zero eval() / new Function()
   * Fully XSS-proof. Supports: + - * / % ** () functions constants
   */
  evaluate(expr) {
    try {
      // Step 1: Basic character whitelist
      if(!/^[\d\s+\-*/%().^a-zA-Z,]*$/.test(expr)) {
        throw new Error('🚫 Invalid characters - only numbers and math operators allowed');
      }

      // Step 2: Normalize
      let processed = expr
        .replace(/\^/g, '**')
        .replace(/\bpi\b/gi, 'PI');

      // Step 3: Validate tokens
      const tokens = this.tokenize(processed);
      for(let token of tokens) {
        if(token === '**') continue;
        if(!this.isValidToken(token)) throw new Error(`Invalid token: ${token}`);
      }

      // Step 4: Pure parse
      const ctx = this.ctx;
      const src = processed.replace(/\s/g, '');
      let pos = 0;

      const peek  = () => src[pos];
      const eat   = () => src[pos++];

      function parseExpr()   { return parseAddSub(); }

      function parseAddSub() {
        let v = parseMulDiv();
        while(pos < src.length && (peek() === '+' || peek() === '-')) {
          const op = eat();
          v = op === '+' ? v + parseMulDiv() : v - parseMulDiv();
        }
        return v;
      }

      function parseMulDiv() {
        let v = parseUnary();
        while(pos < src.length && (peek() === '*' || peek() === '/' || peek() === '%')) {
          if(peek() === '*' && src[pos + 1] === '*') break; // ** handled by parsePow
          const op = eat();
          const r = parseUnary();
          if(op === '*') v *= r;
          else if(op === '/') { if(r === 0) throw new Error('Division by zero'); v /= r; }
          else v %= r;
        }
        return v;
      }

      function parseUnary() {
        if(peek() === '-') { eat(); return -parseUnary(); }
        if(peek() === '+') { eat(); return  parseUnary(); }
        return parsePow();
      }

      function parsePow() {
        let base = parsePrimary();
        if(pos < src.length && peek() === '*' && src[pos + 1] === '*') {
          pos += 2;
          base = Math.pow(base, parseUnary());
        }
        return base;
      }

      function parsePrimary() {
        // Number literal
        if(/\d/.test(peek()) || (peek() === '.' && /\d/.test(src[pos + 1]))) {
          let n = '';
          while(pos < src.length && /[\d.]/.test(peek())) n += eat();
          return parseFloat(n);
        }

        // Identifier: function call or constant
        if(/[a-zA-Z]/.test(peek())) {
          let name = '';
          while(pos < src.length && /[a-zA-Z0-9_]/.test(peek())) name += eat();
          if(!(name in ctx)) throw new Error(`Unknown identifier: ${name}`);
          if(typeof ctx[name] === 'function') {
            if(peek() !== '(') throw new Error(`Expected '(' after ${name}`);
            eat(); // '('
            const args = [];
            if(peek() !== ')') {
              args.push(parseExpr());
              while(peek() === ',') { eat(); args.push(parseExpr()); }
            }
            if(peek() !== ')') throw new Error(`Expected ')' after args of ${name}`);
            eat(); // ')'
            return ctx[name](...args);
          }
          return ctx[name]; // constant
        }

        // Parenthesized group
        if(peek() === '(') {
          eat(); // '('
          const v = parseExpr();
          if(peek() !== ')') throw new Error("Expected closing ')'");
          eat(); // ')'
          return v;
        }

        throw new Error(`Unexpected: '${peek() || 'EOF'}'`);
      }

      const result = parseExpr();

      if(pos < src.length) throw new Error(`Unexpected: '${src[pos]}'`);
      if(typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
        throw new Error('Invalid result');
      }

      return result;

    } catch(err) {
      throw new Error(err.message || 'Evaluation error');
    }
  },

  // Format result for display
  format(result) {
    try {
      if(Number.isInteger(result)) {
        return result.toLocaleString();
      }
      return result.toPrecision(10).replace(/\.?0+$/, '');
    } catch {
      return result.toString();
    }
  },
};

/**
 * MORE SECURE ALTERNATIVE: Pure Expression Parser (no Function/eval)
 * Uncomment below to use this instead of MathEval above
 * Suitable for production-critical environments
 */

/*
export const PureMathParser = {
  parse(expr) {
    const tokens = [];
    const ctx = MathEval.ctx;
    
    // Recursive descent parser
    let pos = 0;
    
    const consume = (expected) => {
      while(expr[pos] === ' ') pos++;
      if(expr[pos] === expected) { pos++; return true; }
      return false;
    };

    const parseAdditive = () => {
      let result = parseMultiplicative();
      while(expr[pos] === '+' || expr[pos] === '-') {
        const op = expr[pos++];
        const right = parseMultiplicative();
        result = op === '+' ? result + right : result - right;
      }
      return result;
    };

    const parseMultiplicative = () => {
      let result = parseUnary();
      while(expr[pos] === '*' || expr[pos] === '/' || expr[pos] === '%') {
        const op = expr[pos++];
        const right = parseUnary();
        if(op === '*') result *= right;
        else if(op === '/') result /= right;
        else result %= right;
      }
      return result;
    };

    const parseExponential = () => {
      let result = parsePrimary();
      if(expr[pos] === '*' && expr[pos+1] === '*') {
        pos += 2;
        result = Math.pow(result, parseUnary());
      }
      return result;
    };

    const parseUnary = () => {
      if(expr[pos] === '-') { pos++; return -parseUnary(); }
      if(expr[pos] === '+') { pos++; return parseUnary(); }
      return parseExponential();
    };

    const parsePrimary = () => {
      while(expr[pos] === ' ') pos++;
      
      // Number
      if(/\d/.test(expr[pos])) {
        let num = '';
        while(/[\d.]/.test(expr[pos])) num += expr[pos++];
        return parseFloat(num);
      }
      
      // Function or constant
      if(/[a-zA-Z]/.test(expr[pos])) {
        let name = '';
        while(/[a-zA-Z0-9_]/.test(expr[pos])) name += expr[pos++];
        if(name in ctx) {
          if(typeof ctx[name] === 'function') {
            consume('(');
            const arg = parseAdditive();
            consume(')');
            return ctx[name](arg);
          }
          return ctx[name];
        }
        throw new Error(`Unknown identifier: ${name}`);
      }
      
      // Parenthesized expression
      if(expr[pos] === '(') {
        pos++;
        const result = parseAdditive();
        consume(')');
        return result;
      }
      
      throw new Error(`Unexpected character: ${expr[pos]}`);
    };

    return parseAdditive();
  },
};
*/
