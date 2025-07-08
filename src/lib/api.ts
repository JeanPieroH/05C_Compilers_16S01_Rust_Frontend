export interface CompileSuccessResponse {
  success: true;
  code: string;
}

export interface CompileErrorResponse {
  success: false;
  code: string;
}

export type CompileResponse = CompileSuccessResponse | CompileErrorResponse;

export interface RunSuccessResponse {
  success: true;
  message: string;
}

export interface RunErrorResponse {
  success: false;
  message: string;
}

export type RunResponse = RunSuccessResponse | RunErrorResponse;

// Mock compilation API
export const compileCode = (code: string): Promise<CompileResponse> => {
  console.log("Compiling code:", code);
  return new Promise((resolve) => {
    setTimeout(() => {
      if (code.includes("Error de tipo")) {
         resolve({
          success: false,
          code: `Error de tipo: 'numbers' no es un array.`
        });
        return;
      }
      
      // Simulate a 70/30 chance of success or failure for demonstration
      if (Math.random() > 0.3) {
        resolve({
          success: true,
          code: `.data
print_str_fmt: .string "%s\\n"
print_int_fmt: .string "%ld\\n"
print_float_fmt: .string "%.17g\\n"
print_newline: .string "\\n"
.LC_array_placeholder: .string "[Array]"
.text
.globl main
fun_main:
  pushq %rbp
  movq %rsp, %rbp
  subq $16, %rsp
  movl $1, -4(%rbp)
  movl $10, -8(%rbp)
  movq $1000000, -16(%rbp)
  movl $20, -4(%rbp)
  movl -4(%rbp), %eax
  movl %eax, %esi
  leaq print_int_fmt(%rip), %rdi
  movl $0, %eax
  call printf@PLT
  movl -8(%rbp), %eax
  movl %eax, %esi
  leaq print_int_fmt(%rip), %rdi
  movl $0, %eax
  call printf@PLT
  movq -16(%rbp), %rax
  movq %rax, %rsi
  leaq print_int_fmt(%rip), %rdi
  movl $0, %eax
  call printf@PLT
  movl $0, %eax
  leave
  ret`,
        });
      } else {
        resolve({
          success: false,
          code: `error: missing '}' at the end of the file
 --> <stdin>:11:1
  |
3 | fn main() {
  |           - this '{' is not closed
...
11| }
   | ^ unclosed delimiter
`,
        });
      }
    }, 1500); // 1.5 second delay
  });
};

// Mock run API
export const runCode = (assemblyCode: string): Promise<RunResponse> => {
  console.log("Running code:", assemblyCode);
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate success/failure
      if (!assemblyCode.includes("error")) {
        resolve({
          success: true,
          message: `20
10
1000000
`,
        });
      } else {
        resolve({
          success: false,
          message: `Segmentation fault (core dumped)`,
        });
      }
    }, 1000); // 1 second delay
  });
};
