# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

---

## Reporting a Vulnerability

We take the security of dotUniverse seriously. If you believe you have found a security vulnerability, please report it to us responsibly.

### How to Report

**Please DO NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email:

**Email:** [kareem209907@gmail.com](mailto:kareem209907@gmail.com)

**Subject:** `[SECURITY] dotUniverse Vulnerability Report`

### What to Include

Please include the following information in your report:

1. **Description** — A clear description of the vulnerability
2. **Impact** — What an attacker could achieve by exploiting this vulnerability
3. **Reproduction Steps** — Detailed steps to reproduce the issue
4. **Affected Components** — Which files or features are affected
5. **Suggested Fix** — If you have a suggestion for how to fix the issue (optional)
6. **Your Contact Info** — So we can follow up with questions

### Example Report

```
Subject: [SECURITY] dotUniverse Vulnerability Report

Description:
The terminal input is vulnerable to XSS when processing user-supplied
commands that contain HTML/JavaScript.

Impact:
An attacker could inject malicious scripts that execute in the context
of other visitors' browsers.

Steps to Reproduce:
1. Open the terminal
2. Type: <script>alert('xss')</script>
3. Press Enter
4. The script executes

Affected Files:
- script.js (runCommand function)

Suggested Fix:
Sanitize user input before rendering to the DOM using textContent
instead of innerHTML where possible.
```

---

## Response Timeline

| Stage | Timeline |
|-------|----------|
| **Acknowledgment** | Within 48 hours |
| **Initial Assessment** | Within 1 week |
| **Fix Development** | Depends on severity |
| **Release** | As soon as possible after fix |

---

## Disclosure Policy

1. **Report received** — We acknowledge receipt within 48 hours
2. **Investigation** — We investigate and validate the report
3. **Fix development** — We develop and test a fix
4. **Release** — We release the fix
5. **Public disclosure** — After the fix is released, we publish details

We aim to coordinate public disclosure with the reporter. We ask that you do not publicly disclose the vulnerability until a fix has been released.

---

## Security Best Practices

If you're contributing to dotUniverse, please follow these security practices:

### Input Sanitization

- Always sanitize user input before rendering to the DOM
- Use `textContent` instead of `innerHTML` when possible
- Use the `escHtml()` function for escaping HTML entities

```javascript
// Good
addLine('<span class="t-val">' + escHtml(userInput) + '</span>');

// Bad
addLine('<span class="t-val">' + userInput + '</span>');
```

### Avoid eval()

- Never use `eval()`, `Function()`, or similar dynamic code execution
- The `calc()` command uses `new Function()` with a controlled scope — do not expand this pattern

### External Resources

- All external resources (fonts, etc.) should use HTTPS
- Validate URLs before using them
- Be cautious with `window.location.href` assignments

### Local Storage

- Do not store sensitive data in localStorage or sessionStorage
- The virtual file system in the terminal is in-memory only — this is intentional

### Dependencies

- This project intentionally has zero dependencies
- Do not add external JavaScript libraries without discussion
- If a dependency is necessary, justify it in a security context

---

## Known Security Considerations

### Terminal Simulation

The interactive terminal is a **client-side simulation**. It does not:

- Execute actual system commands
- Access the file system
- Make network requests (except mailto: links)
- Store persistent data

The virtual file system exists only in JavaScript memory and is cleared on page refresh.

### Easter Eggs

The `rm -rf` Easter egg triggers a CSS animation sequence. It does not:

- Delete any actual files
- Make any destructive API calls
- Persist any state

### mailto: Links

Contact commands (`contact`, `ask`, `collab`) open the user's email client via `mailto:` links. No data is sent to a server.

---

## Scope

This security policy applies to:

- The dotUniverse portfolio website (index.html, styles.css, script.js)
- All assets in the repository

This policy does NOT apply to:

- Third-party VS Code extensions listed on the site (they have their own security policies)
- External links and platforms (dev.to, LinkedIn, GitHub, etc.)
- The user's local development environment

---

## Security Updates

Security updates will be:

1. Committed with a `fix(security):` prefix
2. Documented in [CHANGELOG.md](CHANGELOG.md) under a "Security" section
3. Tagged with a patch version bump (e.g., 1.0.1)

---

## Contact

For security concerns, contact:

- **Email:** [kareem209907@gmail.com](mailto:kareem209907@gmail.com)
- **Subject:** `[SECURITY] dotUniverse`

For non-security issues, please use [GitHub Issues](https://github.com/kareem2099/dotuniverse/issues).

---

## Acknowledgments

We appreciate security researchers who responsibly disclose vulnerabilities. With your permission, we will credit you in:

- The security advisory
- The CHANGELOG.md entry
- A "Security Contributors" section (if applicable)

---

<div align="center">

**Thank you for helping keep dotUniverse secure!**

</div>