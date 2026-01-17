const PYODIDE_MJS_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.mjs';

let pyodidePromise = null;

const loadPyodideModule = async () => {
  const mod = await import(/* @vite-ignore */ PYODIDE_MJS_URL);
  if (!mod?.loadPyodide) {
    throw new Error('No se pudo cargar Pyodide correctamente');
  }
  return mod;
};

export const getPyodide = async () => {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      const { loadPyodide } = await loadPyodideModule();
      const pyodide = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/',
      });
      return pyodide;
    })();
  }

  return pyodidePromise;
};

export const runPython = async (code, options = {}) => {
  const pyodide = await getPyodide();

  const codeStr = String(code ?? '');
  pyodide.globals.set('__user_code__', codeStr);

  const runner = `
import sys, io, builtins, traceback

__stdout = io.StringIO()
__stderr = io.StringIO()

__old_stdout = sys.stdout
__old_stderr = sys.stderr

sys.stdout = __stdout
sys.stderr = __stderr

try:
    from js import prompt as __js_prompt
    def input(prompt_text=""):
        try:
            v = __js_prompt(str(prompt_text))
            return "" if v is None else str(v)
        except Exception:
            return ""
    builtins.input = input
except Exception:
    pass

__result = None
try:
    exec(__user_code__, globals())
except Exception:
    traceback.print_exc()
finally:
    sys.stdout = __old_stdout
    sys.stderr = __old_stderr

(__stdout.getvalue(), __stderr.getvalue())
`;

  const [stdout, stderr] = await pyodide.runPythonAsync(runner);

  if (typeof options.onStdout === 'function' && stdout) {
    options.onStdout(stdout);
  }

  if (typeof options.onStderr === 'function' && stderr) {
    options.onStderr(stderr);
  }

  return {
    stdout: stdout || '',
    stderr: stderr || '',
  };
};
