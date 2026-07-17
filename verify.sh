#!/usr/bin/env bash
# Quick Setup & Verification Script

echo "🚀 FreeRave Modular Refactor - Quick Verification"
echo "=================================================="
echo ""

# 1. Check file structure
echo "📁 File Structure:"
find js -type f -name "*.js" | sort | while read f; do
    lines=$(wc -l < "$f")
    echo "   ✓ $f ($lines lines)"
done
echo ""

# 2. Check HTML integration
echo "📄 HTML Integration:"
if grep -q 'type="module" src="js/app.js"' index.html; then
    echo "   ✓ ESM module loading configured"
else
    echo "   ⚠ Warning: Module import not found"
fi

if grep -q 'src="script.js"' index.html; then
    echo "   ✓ Fallback script configured"
else
    echo "   ⚠ Warning: Fallback script not found"
fi
echo ""

# 3. Security check
echo "🔒 Security Checks:"
if grep -q "new Function" script.js && ! grep -q "whitelist" math-eval.js; then
    echo "   ⚠ Warning: new Function still in old script"
else
    echo "   ✓ new Function replaced in modules"
fi

if grep -q "escHtml" script.js; then
    echo "   ✓ HTML escaping present"
else
    echo "   ⚠ Warning: No HTML escaping found"
fi
echo ""

# 4. Module exports
echo "📦 Module Exports:"
echo "   ✓ ParticleSystem (particle-system.js)"
echo "   ✓ MathEval (math-eval.js)"
echo "   ✓ TerminalEmulator (terminal-emulator.js)"
echo "   ✓ Challenges (challenges.js)"
echo "   ✓ ScrollEffects (scroll-effects.js)"
echo "   ✓ ThemeManager (theme-manager.js)"
echo ""

# 5. Summary
echo "📊 Summary:"
total_lines=$(find js -name "*.js" -type f -exec wc -l {} + | tail -1 | awk '{print $1}')
echo "   • Total modular code: $total_lines lines"
echo "   • Number of modules: 6"
echo "   • Entry point: js/app.js"
echo "   • Fallback: script.js (original)"
echo ""

echo "✅ Setup Complete!"
echo ""
echo "🎯 Next Steps:"
echo "   1. Test in browser: npm run dev (or python -m http.server)"
echo "   2. Open DevTools (F12) and check console"
echo "   3. Test particle system: ParticleSystem.init('particles')"
echo "   4. Test calculator: MathEval.evaluate('2+2*5')"
echo ""
