// Made by library/build.js from concepts/ and known.json. Do not edit it: change those files, and run node library/build.js.
const LIBRARY = {
 "entries": {
  "argument-label": {
   "id": "argument-label",
   "name": "Argument label",
   "first": "The name before a colon in a call, which says which parameter the next value is for.",
   "parts": []
  },
  "argument": {
   "id": "argument",
   "name": "Argument",
   "first": "A value given to a parameter in a call. Its type must be the type of that parameter.",
   "parts": []
  },
  "async-function": {
   "id": "async-function",
   "name": "Async function",
   "area": "conc",
   "first": "A function that can stop partway through while it waits, free its thread for other code, and go on later from the same place.",
   "parts": [
    "function",
    "async-keyword",
    "await",
    "suspension-point"
   ],
   "dependsOn": [
    {
     "id": "function",
     "views": [
      "what",
      "parts"
     ],
     "why": "An async function is a function, with a name, parameters, a return type, and a body, that can also suspend.",
     "whyInExample": "`makeTea(cups:)` is declared with `func`, as `greet` is. It has a name, a parameter, a return type, and a body."
    },
    {
     "id": "thread",
     "views": [
      "what",
      "parts",
      "memory"
     ],
     "why": "An async function frees its thread while it is suspended, so that thread can run other code.",
     "whyInExample": "On line 4, `makeTea(cups:)` waits one second without using its thread."
    },
    {
     "id": "stack-frame",
     "views": [
      "memory"
     ],
     "why": "The values of an async function cannot be kept in a stack frame, because its thread's stack is used by other code while it is suspended.",
     "whyInExample": "`water` is set on line 3, before the wait, and used on line 5, after it. While `makeTea(cups:)` waits, its thread is free to run other code, so `water` is not kept in a stack frame on that thread's stack."
    },
    {
     "id": "heap-object",
     "views": [
      "memory"
     ],
     "why": "Swift keeps the values of an async function on the heap, so they stay while its thread runs other code.",
     "whyInExample": "Swift keeps `water` on the heap, so it still holds 500 when `makeTea(cups:)` goes on after the wait."
    }
   ],
   "example": {
    "code": [
     "func makeTea(cups: Int) async -> String {",
     "    print(\"Boiling water\")",
     "    let water = cups * 250",
     "    try? await Task.sleep(for: .seconds(1))",
     "    return \"\\(water) ml of tea\"",
     "}",
     "print(\"Start\")",
     "let tea = await makeTea(cups: 2)",
     "print(tea)"
    ],
    "probes": [
     {
      "after": 1,
      "print": "cups",
      "values": [
       "2"
      ]
     },
     {
      "after": 3,
      "print": "water",
      "values": [
       "500"
      ]
     }
    ],
    "sil": [
     {
      "in": "makeTea(cups:)",
      "has": "$@convention(thin) @async (Int) -> @owned String",
      "shows": "async on line 1 makes makeTea(cups:) an async function."
     }
    ],
    "ir": [
     {
      "in": "async_Main",
      "has": "call swiftcc ptr @swift_task_alloc(",
      "shows": "Line 8 makes an async frame for the call of makeTea(cups:) with swift_task_alloc, which takes its memory from the heap, not from the thread's stack."
     },
     {
      "in": "makeTea(cups:)",
      "has": "%cups.debug = getelementptr inbounds %\"$s7Example7makeTea4cupsSSSi_tYaF.Frame\"",
      "shows": "cups is kept in the async frame of makeTea(cups:)."
     },
     {
      "in": "makeTea(cups:)",
      "has": "%water.debug = getelementptr inbounds %\"$s7Example7makeTea4cupsSSSi_tYaF.Frame\"",
      "shows": "water is kept in the async frame of makeTea(cups:)."
     },
     {
      "in": "makeTea(cups:)",
      "lacks": "= alloca ",
      "shows": "makeTea(cups:) keeps none of its values on the thread's stack."
     },
     {
      "in": "async_Main",
      "has": "call swiftcc void @swift_task_dealloc(",
      "shows": "After makeTea(cups:) returns, the code of line 8 frees its async frame."
     }
    ]
   },
   "snippets": {
    "double": {
     "code": [
      "func double(_ n: Int) -> Int {",
      "    return n * 2",
      "}",
      "print(double(4))  // 8"
     ],
     "output": [
      "8"
     ]
    }
   },
   "views": {
    "what": {
     "is": "An async function is a function that can suspend: stop partway through its body, free its thread, and go on later from the same place. You write `async` in its declaration, and `await` where it is called.",
     "marks": [
      {
       "line": 1,
       "text": "async",
       "part": "async-keyword",
       "label": "async"
      },
      {
       "line": 8,
       "text": "await",
       "part": "await",
       "label": "await"
      }
     ],
     "afterExample": "`makeTea(cups:)` is an async function. It suspends at the `await` on line 4 while it waits one second. Then it goes on, and returns.",
     "problem": "Some work has to wait: for data from the network, for a file, or for a timer. A plain function that waits keeps its thread the whole time, so the thread can run nothing else. When that thread is the main thread, the app's screen stops responding until the wait ends.",
     "how": "An async function can suspend only at an `await`. While it is suspended, it does not use its thread, so the thread is free to run other code. When the call after `await` returns, the function goes on from there, and its constants and variables still hold their values.",
     "when": [
      {
       "text": "Use one when a function has to wait for something, such as data from the network, a file, or a timer. Many of Apple's functions for these are async functions, such as `Task.sleep`, and code can call them with `await` only where it can suspend, such as in an async function."
      },
      {
       "text": "Don't use one to run two pieces of work at the same time. The code that calls an async function with `await` waits until it returns, as line 8 waits for `makeTea(cups:)`. Work that runs at the same time as other work is a task."
      },
      {
       "text": "Don't make a function async when it never waits. Each call of an async function needs `await`, and can be made only from code that can suspend. `double(_:)` never waits, so it is a plain function, and any code can call it:",
       "snippet": "double"
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "function",
       "name": "The function, `makeTea(cups:)`",
       "text": "`makeTea(cups:)` is declared with `func`, as any function is. It has a name, the parameter `cups`, the return type `String`, and a body, on lines 2 to 5."
      },
      {
       "part": "async-keyword",
       "name": "`async`",
       "text": "The word `async`, on line 1, makes `makeTea(cups:)` an async function: a function that can suspend. It is written after the parameter list, before `->`."
      },
      {
       "part": "await",
       "name": "`await`",
       "text": "`await` is written before each call of an async function. Line 4 calls `Task.sleep(for: .seconds(1))`, an async function from Swift's standard library that waits for the time it is given. Line 8 calls `makeTea(cups: 2)`. A call of an async function without `await` does not build. `await` can be written only in code that can suspend: in the body of an async function, as on line 4, or at the top level of a program's main file, as on line 8. On line 4, `try?` comes before `await`, because `Task.sleep(for: .seconds(1))` can also throw an error, and `try?` ignores that error."
      },
      {
       "part": "suspension-point",
       "name": "Suspension points, on lines 4 and 8",
       "text": "Each `await` marks a suspension point: a place where the code can suspend. To suspend is to stop running, and free the thread, until the call after `await` returns. At line 4, `makeTea(cups:)` can suspend while `Task.sleep(for: .seconds(1))` waits. At line 8, the top-level code can suspend until `makeTea(cups:)` returns. In this program, these are the only two places where code can suspend, and both are marked with `await`."
      }
     ],
     "marks": [
      {
       "line": 1,
       "text": "func",
       "part": "function",
       "label": "a function"
      },
      {
       "line": 1,
       "text": "async",
       "part": "async-keyword",
       "label": "async"
      },
      {
       "line": 4,
       "text": "try? await Task.sleep(for: .seconds(1))",
       "part": "suspension-point",
       "label": "suspension point"
      },
      {
       "line": 4,
       "text": "await",
       "part": "await",
       "label": "await"
      },
      {
       "line": 8,
       "text": "await makeTea(cups: 2)",
       "part": "suspension-point",
       "label": "suspension point"
      },
      {
       "line": 8,
       "text": "await",
       "part": "await",
       "label": "await"
      }
     ],
     "steps": [
      {
       "text": "Line 7 prints {{Start}}.",
       "line": 7,
       "prints": [
        "Start"
       ]
      },
      {
       "text": "Line 8 calls `makeTea(cups: 2)` with `await`. The top-level code waits at line 8 until the call returns.",
       "line": 8
      },
      {
       "text": "The body runs, and line 2 prints {{Boiling water}}.",
       "line": 2,
       "prints": [
        "Boiling water"
       ]
      },
      {
       "text": "Line 3 sets `water` to 500.",
       "line": 3,
       "value": {
        "line": 3,
        "name": "water",
        "is": "500"
       }
      },
      {
       "text": "Line 4 calls `Task.sleep(for: .seconds(1))` with `await`, and `makeTea(cups:)` suspends: it stops running, and frees its thread. No other code in this program is waiting to run, so for one second none of the program's code runs.",
       "line": 4,
       "dim": [
        5
       ]
      },
      {
       "text": "One second later, the wait ends, and `makeTea(cups:)` goes on from line 4, where it stopped. `water` still holds 500, so line 5 returns the string \"500 ml of tea\", and the call ends.",
       "line": 5,
       "also": [
        4
       ],
       "value": {
        "line": 5,
        "name": "water",
        "is": "500"
       }
      },
      {
       "text": "Line 8 stores the returned string in `tea`, and line 9 prints {{500 ml of tea}}.",
       "line": 9,
       "also": [
        8
       ],
       "value": {
        "line": 8,
        "name": "tea",
        "is": "\"500 ml of tea\""
       },
       "prints": [
        "500 ml of tea"
       ]
      }
     ],
     "end": {
      "kind": "question",
      "text": "`makeTea(cups:)` stopped at line 4 and freed its thread, but when it went on, `water` still held 500. Where was `water` kept while `makeTea(cups:)` was suspended?"
     }
    },
    "memory": {
     "question": "`makeTea(cups:)` suspended at line 4, and its thread was free to run other code. When it went on, `water` still held 500. Where was `water` kept while `makeTea(cups:)` was suspended?",
     "steps": [
      {
       "text": "Line 7 prints {{Start}}. Line 8 calls `makeTea(cups: 2)`, and Swift makes an async frame for the call: memory that holds the call's parameters, constants, and variables, as a stack frame does, but on the heap, not on the thread's stack. `cups` in it is 2.",
       "line": 8,
       "also": [
        7
       ],
       "prints": [
        "Start"
       ],
       "blocks": [
        {
         "id": "af",
         "kind": "async",
         "title": "makeTea(cups:)",
         "fields": [
          [
           "cups",
           "2"
          ],
          [
           "water",
           null
          ]
         ]
        }
       ],
       "highlight": [
        "af"
       ]
      },
      {
       "text": "Line 2 prints {{Boiling water}}, and line 3 sets `water` to 500, in the async frame.",
       "line": 3,
       "also": [
        2
       ],
       "prints": [
        "Boiling water"
       ],
       "blocks": [
        {
         "id": "af",
         "kind": "async",
         "title": "makeTea(cups:)",
         "fields": [
          [
           "cups",
           "2"
          ],
          [
           "water",
           "500"
          ]
         ]
        }
       ],
       "highlight": [
        "af"
       ]
      },
      {
       "text": "Line 4 suspends `makeTea(cups:)`. Its code stops running, and its thread is free to run other code. `cups` and `water` are not on the thread's stack, so nothing has to be kept there: they stay in the async frame, on the heap.",
       "line": 4,
       "blocks": [
        {
         "id": "af",
         "kind": "async",
         "title": "makeTea(cups:)",
         "fields": [
          [
           "cups",
           "2"
          ],
          [
           "water",
           "500"
          ]
         ]
        }
       ],
       "highlight": [
        "af"
       ]
      },
      {
       "text": "One second later, `makeTea(cups:)` goes on from line 4, on a thread that is free. Line 5 reads `water` from the async frame, and returns the string \"500 ml of tea\". The call has ended, so Swift frees its async frame.",
       "line": 5,
       "also": [
        4
       ],
       "blocks": [
        {
         "id": "af",
         "kind": "removed",
         "where": "heap",
         "title": "makeTea(cups:)",
         "text": "its async frame is freed"
        }
       ],
       "highlight": []
      },
      {
       "text": "Line 8 stores the returned string in `tea`, a constant at the top level of the file, and line 9 prints {{500 ml of tea}}.",
       "line": 9,
       "also": [
        8
       ],
       "prints": [
        "500 ml of tea"
       ],
       "blocks": [
        {
         "id": "af",
         "kind": "removed",
         "where": "heap",
         "title": "makeTea(cups:)",
         "text": "its async frame is freed"
        },
        {
         "id": "tea",
         "kind": "global",
         "title": "tea",
         "tag": "constant",
         "fields": [
          [
           "tea",
           "\"500 ml of tea\""
          ]
         ]
        }
       ],
       "highlight": [
        "tea"
       ]
      }
     ],
     "answer": "`water` was kept in the async frame of `makeTea(cups:)`, on the heap, from line 3 until the call returned. The thread's stack held none of the call's values, so the thread was free while `makeTea(cups:)` was suspended."
    }
   }
  },
  "async-keyword": {
   "id": "async-keyword",
   "name": "async",
   "first": "The word, written after a function's parameter list, that makes it an async function.",
   "parts": []
  },
  "await": {
   "id": "await",
   "name": "await",
   "first": "The word written before each call of an async function. It can be written only in code that can suspend.",
   "parts": []
  },
  "body": {
   "id": "body",
   "name": "Body",
   "first": "The code that runs each time a function or closure is called.",
   "parts": []
  },
  "braces": {
   "id": "braces",
   "name": "Braces",
   "first": "The two brace characters that mark where a closure starts and where it ends. Everything between them belongs to the closure.",
   "parts": []
  },
  "call": {
   "id": "call",
   "name": "Call",
   "first": "A function's name followed by parentheses, which runs the function with the arguments inside them.",
   "parts": [
    "argument-label",
    "argument"
   ]
  },
  "capture": {
   "id": "capture",
   "name": "Capture",
   "area": "swift",
   "first": "A closure keeps each outside constant and variable that its body uses.",
   "parts": [
    "declared-outside",
    "used-in-body"
   ],
   "dependsOn": [
    {
     "id": "closure",
     "views": [
      "what",
      "parts"
     ],
     "why": "Capture is what a closure does with a constant or variable from outside its braces that its body uses."
    }
   ],
   "example": {
    "code": [
     "func sayHello() {",
     "    let greeting = \"Hello\"",
     "    let greet = { (name: String) in",
     "        print(\"\\(greeting), \\(name)\")",
     "    }",
     "    greet(\"Ana\")",
     "    greet(\"Bo\")",
     "}",
     "sayHello()"
    ],
    "sil": [
     {
      "in": "closure #1 in sayHello()",
      "has": "%1 : @closureCapture $String",
      "shows": "The closure's code receives greeting as a captured value, apart from its parameter name."
     }
    ]
   },
   "views": {
    "what": {
     "is": "Capture is what a closure does with a constant or variable that is declared outside its braces and used in its body: the closure keeps it, so the body can use it each time the closure runs.",
     "marks": [
      {
       "line": 2,
       "text": "greeting",
       "part": "declared-outside",
       "label": "declared outside the braces"
      },
      {
       "line": 4,
       "text": "greeting",
       "part": "used-in-body",
       "label": "used in the body"
      }
     ],
     "afterExample": "`greeting` is declared on line 2, outside the closure's braces, and the body uses it on line 4. So the closure captures `greeting`.",
     "problem": "A closure's body often needs a value that the code around the closure already has, such as `greeting`. Capture lets the body use that value by its name, without passing it in as an argument at each call.",
     "how": "When line 3 makes the closure, the closure captures `greeting`. Each call of `greet` runs the body, and the body uses the captured `greeting`.",
     "when": [
      {
       "text": "Capture happens on its own, whenever the body uses a name from outside the braces. So the choice is between a captured value and a parameter. A captured value, such as `greeting`, is the same at every call. A parameter, such as `name`, gets a new value from each call."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "declared-outside",
       "name": "Declared outside the braces",
       "text": "`greeting` is declared on line 2, inside `sayHello()`, before the closure's `{` on line 3. So it is outside the closure's braces."
      },
      {
       "part": "used-in-body",
       "name": "Used in the body",
       "text": "The body uses `greeting` on line 4. Each name that the body uses, and that is declared outside the braces, is a name the closure captures."
      }
     ],
     "marks": [
      {
       "line": 2,
       "text": "greeting",
       "part": "declared-outside",
       "label": "declared outside the braces"
      },
      {
       "line": 4,
       "text": "greeting",
       "part": "used-in-body",
       "label": "used in the body"
      }
     ],
     "steps": [
      {
       "text": "Line 9 calls `sayHello()`.",
       "line": 9
      },
      {
       "text": "Line 2 sets `greeting` to `\"Hello\"`.",
       "line": 2
      },
      {
       "text": "Line 3 makes the closure, and stores it in `greet`. The closure captures `greeting`. The body does not run yet.",
       "line": 3,
       "dim": [
        4
       ]
      },
      {
       "text": "Line 6 calls `greet` with `\"Ana\"`. The body runs, uses the captured `greeting`, and prints {{Hello, Ana}}.",
       "line": 6,
       "also": [
        4
       ],
       "value": {
        "line": 4,
        "name": "greeting",
        "is": "\"Hello\""
       },
       "prints": [
        "Hello, Ana"
       ]
      },
      {
       "text": "Line 7 calls `greet` with `\"Bo\"`. The body uses the same captured `greeting`, and prints {{Hello, Bo}}.",
       "line": 7,
       "also": [
        4
       ],
       "value": {
        "line": 4,
        "name": "greeting",
        "is": "\"Hello\""
       },
       "prints": [
        "Hello, Bo"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The closure keeps `greeting` from line 3 on. Both calls of `greet` use it, and neither call passes it as an argument."
     }
    }
   }
  },
  "captured-constant": {
   "id": "captured-constant",
   "name": "Captured constant",
   "first": "A constant from outside a closure's braces, such as a parameter of the function around it, that the body uses. The body can read it, but not change it.",
   "parts": []
  },
  "captured-variables": {
   "id": "captured-variables",
   "name": "Captured variables",
   "area": "memory",
   "first": "A variable, declared outside a closure, that the closure's body uses.",
   "parts": [
    "closure",
    "variable-outside-closure",
    "variable-used-in-body",
    "captured-constant"
   ],
   "dependsOn": [
    {
     "id": "closure",
     "views": [
      "what",
      "parts"
     ],
     "why": "A captured variable is a variable that a closure's body uses.",
     "whyInExample": "`makeCounter(step:)` returns a closure, and each call of `counter()` runs that closure's body."
    },
    {
     "id": "stack-frame",
     "views": [
      "memory"
     ],
     "why": "A captured variable is declared in a stack frame, which is removed when its call returns.",
     "whyInExample": "`count` is declared inside `makeCounter(step:)`, but it still exists after that call's frame is removed. So `count` cannot be kept in the frame."
    },
    {
     "id": "heap-object",
     "views": [
      "memory"
     ],
     "why": "Swift keeps a captured variable in a box, and the box is a heap object.",
     "whyInExample": "`count` has to stay after `makeCounter(step:)` returns, and a stack frame cannot keep it. A heap object can."
    },
    {
     "id": "closure-value",
     "views": [
      "memory"
     ],
     "why": "The context of the closure value holds the address of the box that keeps a captured variable.",
     "whyInExample": "`counter` holds a closure value. Its context is where the closure finds `count` after `makeCounter(step:)` returns."
    }
   ],
   "example": {
    "code": [
     "func makeCounter(step: Int) -> () -> Int {",
     "    var count = 0",
     "    return {",
     "        count += step",
     "        return count",
     "    }",
     "}",
     "let counter = makeCounter(step: 2)",
     "print(counter())  // 2",
     "print(counter())  // 4"
    ],
    "probes": [
     {
      "after": 1,
      "print": "step",
      "values": [
       "2"
      ]
     },
     {
      "after": 2,
      "print": "count",
      "values": [
       "0"
      ]
     }
    ],
    "sil": [
     {
      "in": "makeCounter(step:)",
      "has": "alloc_box ${ var Int }, var, name \"count\"",
      "shows": "Line 2 keeps count in a box, which is a heap object."
     },
     {
      "in": "makeCounter(step:)",
      "has": "partial_apply [callee_guaranteed]",
      "shows": "Line 3 makes the closure's context on the heap."
     },
     {
      "in": "closure #1 in makeCounter(step:)",
      "has": "%0 : @closureCapture ${ var Int }",
      "shows": "The context holds the address of the box."
     },
     {
      "in": "closure #1 in makeCounter(step:)",
      "has": "%1 : @closureCapture $Int",
      "shows": "The context holds the value of step."
     }
    ]
   },
   "snippets": {
    "total": {
     "code": [
      "func total(of prices: [Int]) -> Int {",
      "    var sum = 0",
      "    prices.forEach { sum += $0 }",
      "    return sum",
      "}",
      "print(total(of: [3, 4]))  // 7"
     ],
     "output": [
      "7"
     ]
    },
    "copy": {
     "code": [
      "func showCopy() {",
      "    var count = 0",
      "    let show = { [count] in print(count) }",
      "    count = 5",
      "    show()  // 0",
      "}",
      "showCopy()"
     ],
     "output": [
      "0"
     ]
    }
   },
   "views": {
    "what": {
     "is": "A captured variable is a variable, declared outside a closure, that the closure's body uses. The closure uses that same variable, not a copy of it.",
     "marks": [
      {
       "line": 2,
       "text": "count",
       "part": "variable-outside-closure",
       "label": "declared outside the closure"
      },
      {
       "line": 4,
       "text": "count",
       "part": "variable-used-in-body",
       "label": "used in the body"
      },
      {
       "line": 5,
       "text": "count",
       "part": "variable-used-in-body"
      }
     ],
     "afterExample": "`count` is declared inside `makeCounter(step:)`, outside the closure's braces, and the closure's body uses it. So `count` is a captured variable.",
     "problem": "A closure sometimes needs to keep a value between its calls. `counter()` has to keep how far it has counted. A captured variable does this without a global variable or a class.",
     "how": "The closure keeps `count` itself, so every call of `counter()` changes the same `count`. The first call makes it 2, and the second makes it 4. This still works after `makeCounter(step:)` has returned, because the closure still has `count`.",
     "when": [
      {
       "text": "Use one when a closure has to keep or change a value between calls, or change a value that the code around it reads afterward:",
       "snippet": "total"
      },
      {
       "text": "Don't use one when the closure should see the value as it was when the closure was made. Instead, put the name in a capture list: names in square brackets at the start of the closure, such as `[count]`. The closure then gets its own copy:",
       "snippet": "copy"
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "closure",
       "name": "The closure, lines 3 to 6",
       "text": "`makeCounter(step:)` returns this closure. It takes no parameters and returns an `Int`, as `() -> Int` on line 1 says."
      },
      {
       "part": "variable-outside-closure",
       "name": "The variable `count`",
       "text": "`count` is a variable declared on line 2, inside `makeCounter(step:)` but outside the closure's braces."
      },
      {
       "part": "variable-used-in-body",
       "name": "Where the body uses it",
       "text": "The body changes `count` on line 4, and returns it on line 5. These uses are what make `count` a captured variable."
      },
      {
       "part": "captured-constant",
       "name": "`step`, captured too",
       "text": "The body also uses `step`, the parameter on line 1. `step` is captured too, but a parameter is a constant, so the body only reads it."
      }
     ],
     "marks": [
      {
       "line": 1,
       "text": "step",
       "part": "captured-constant",
       "label": "parameter"
      },
      {
       "line": 2,
       "text": "count",
       "part": "variable-outside-closure",
       "label": "declared outside the closure"
      },
      {
       "line": 3,
       "text": "{",
       "part": "closure",
       "label": "the closure"
      },
      {
       "line": 4,
       "text": "count",
       "part": "variable-used-in-body",
       "label": "used in the body"
      },
      {
       "line": 4,
       "text": "step",
       "part": "captured-constant"
      },
      {
       "line": 5,
       "text": "count",
       "part": "variable-used-in-body"
      },
      {
       "line": 6,
       "text": "}",
       "part": "closure"
      }
     ],
     "steps": [
      {
       "text": "Line 8 calls `makeCounter(step: 2)`, so `step` is 2.",
       "line": 8
      },
      {
       "text": "Line 2 sets `count` to 0.",
       "line": 2
      },
      {
       "text": "Line 3 returns the closure, and the call of `makeCounter(step:)` ends. The closure's body does not run.",
       "line": 3,
       "dim": [
        4,
        5
       ]
      },
      {
       "text": "Line 8 stores the closure in `counter`.",
       "line": 8
      },
      {
       "text": "Line 9 calls `counter()`. The body adds `step` to `count`, so `count` is 2, and returns it. Line 9 prints {{2}}.",
       "line": 9,
       "also": [
        4,
        5
       ],
       "value": {
        "line": 4,
        "name": "count",
        "is": "2"
       },
       "prints": [
        "2"
       ]
      },
      {
       "text": "Line 10 calls `counter()` again. `count` is still 2 from the last call, so it becomes 4, and line 10 prints {{4}}.",
       "line": 10,
       "also": [
        4,
        5
       ],
       "value": {
        "line": 4,
        "name": "count",
        "is": "4"
       },
       "prints": [
        "4"
       ]
      }
     ],
     "end": {
      "kind": "question",
      "text": "`makeCounter(step:)` returned at step 3, but `count` still exists, and each call of `counter()` changes it. Where is `count` kept?"
     }
    },
    "memory": {
     "question": "`makeCounter(step:)` has returned, so its stack frame is gone. Where is `count` kept?",
     "steps": [
      {
       "text": "Line 8 calls `makeCounter(step: 2)`. A stack frame is made for the call, and `step` in it is 2.",
       "line": 8,
       "blocks": [
        {
         "id": "mc",
         "kind": "frame",
         "title": "makeCounter(step:)",
         "fields": [
          [
           "step",
           "2"
          ]
         ]
        },
        {
         "id": "code",
         "kind": "code",
         "title": "the closure's code",
         "tag": "lines 3 to 6",
         "text": "count += step …"
        }
       ],
       "highlight": [
        "mc"
       ]
      },
      {
       "text": "Line 2 makes `count`. The closure captures `count` and changes it, so Swift keeps `count` in a box: a heap object. The box holds 0, and the frame holds the address of the box.",
       "line": 2,
       "blocks": [
        {
         "id": "mc",
         "kind": "frame",
         "title": "makeCounter(step:)",
         "fields": [
          [
           "step",
           "2"
          ],
          [
           "count",
           {
            "to": "box"
           }
          ]
         ]
        },
        {
         "id": "box",
         "kind": "heap",
         "title": "box",
         "fields": [
          [
           "count",
           "0"
          ]
         ]
        },
        {
         "id": "code",
         "kind": "code",
         "title": "the closure's code",
         "tag": "lines 3 to 6",
         "text": "count += step …"
        }
       ],
       "highlight": [
        "box"
       ]
      },
      {
       "text": "Line 3 makes the closure. Its context is made on the heap. The context holds the address of the box, and `step`, which is 2.",
       "line": 3,
       "also": [
        4,
        5,
        6
       ],
       "blocks": [
        {
         "id": "mc",
         "kind": "frame",
         "title": "makeCounter(step:)",
         "fields": [
          [
           "step",
           "2"
          ],
          [
           "count",
           {
            "to": "box"
           }
          ]
         ]
        },
        {
         "id": "box",
         "kind": "heap",
         "title": "box",
         "fields": [
          [
           "count",
           "0"
          ]
         ]
        },
        {
         "id": "ctx",
         "kind": "heap",
         "title": "context",
         "fields": [
          [
           "count",
           {
            "to": "box"
           }
          ],
          [
           "step",
           "2"
          ]
         ]
        },
        {
         "id": "code",
         "kind": "code",
         "title": "the closure's code",
         "tag": "lines 3 to 6",
         "text": "count += step …"
        }
       ],
       "highlight": [
        "ctx"
       ]
      },
      {
       "text": "Line 3 returns the closure, and the frame of `makeCounter(step:)` is removed. Line 8 stores the closure value in `counter`: the address of its code, and the address of its context. The box stays, because the context holds its address.",
       "line": 8,
       "also": [
        3
       ],
       "blocks": [
        {
         "id": "mc",
         "kind": "removed",
         "title": "makeCounter(step:)",
         "text": "its frame is gone"
        },
        {
         "id": "counter",
         "kind": "global",
         "title": "counter",
         "tag": "closure value",
         "fields": [
          [
           "code",
           {
            "to": "code"
           }
          ],
          [
           "context",
           {
            "to": "ctx"
           }
          ]
         ]
        },
        {
         "id": "box",
         "kind": "heap",
         "title": "box",
         "fields": [
          [
           "count",
           "0"
          ]
         ]
        },
        {
         "id": "ctx",
         "kind": "heap",
         "title": "context",
         "fields": [
          [
           "count",
           {
            "to": "box"
           }
          ],
          [
           "step",
           "2"
          ]
         ]
        },
        {
         "id": "code",
         "kind": "code",
         "title": "the closure's code",
         "tag": "lines 3 to 6",
         "text": "count += step …"
        }
       ],
       "highlight": [
        "counter"
       ]
      },
      {
       "text": "Line 9 calls `counter()`. The body uses the context to find the box, and adds `step` to the `count` in it, so the box holds 2. Line 9 prints {{2}}.",
       "line": 9,
       "also": [
        4,
        5
       ],
       "prints": [
        "2"
       ],
       "blocks": [
        {
         "id": "mc",
         "kind": "removed",
         "title": "makeCounter(step:)",
         "text": "its frame is gone"
        },
        {
         "id": "counter",
         "kind": "global",
         "title": "counter",
         "tag": "closure value",
         "fields": [
          [
           "code",
           {
            "to": "code"
           }
          ],
          [
           "context",
           {
            "to": "ctx"
           }
          ]
         ]
        },
        {
         "id": "box",
         "kind": "heap",
         "title": "box",
         "fields": [
          [
           "count",
           "2"
          ]
         ]
        },
        {
         "id": "ctx",
         "kind": "heap",
         "title": "context",
         "fields": [
          [
           "count",
           {
            "to": "box"
           }
          ],
          [
           "step",
           "2"
          ]
         ]
        },
        {
         "id": "code",
         "kind": "code",
         "title": "the closure's code",
         "tag": "lines 3 to 6",
         "text": "count += step …"
        }
       ],
       "highlight": [
        "box"
       ]
      },
      {
       "text": "Line 10 calls `counter()` again. The box holds 4, and line 10 prints {{4}}.",
       "line": 10,
       "also": [
        4,
        5
       ],
       "prints": [
        "4"
       ],
       "blocks": [
        {
         "id": "mc",
         "kind": "removed",
         "title": "makeCounter(step:)",
         "text": "its frame is gone"
        },
        {
         "id": "counter",
         "kind": "global",
         "title": "counter",
         "tag": "closure value",
         "fields": [
          [
           "code",
           {
            "to": "code"
           }
          ],
          [
           "context",
           {
            "to": "ctx"
           }
          ]
         ]
        },
        {
         "id": "box",
         "kind": "heap",
         "title": "box",
         "fields": [
          [
           "count",
           "4"
          ]
         ]
        },
        {
         "id": "ctx",
         "kind": "heap",
         "title": "context",
         "fields": [
          [
           "count",
           {
            "to": "box"
           }
          ],
          [
           "step",
           "2"
          ]
         ]
        },
        {
         "id": "code",
         "kind": "code",
         "title": "the closure's code",
         "tag": "lines 3 to 6",
         "text": "count += step …"
        }
       ],
       "highlight": [
        "box"
       ]
      }
     ],
     "answer": "`count` is kept in a box on the heap, and the closure's context holds the address of the box."
    }
   }
  },
  "closure-code": {
   "id": "closure-code",
   "name": "The closure's code",
   "first": "The code that the compiler makes from a closure's body. It is kept with the rest of the program's code.",
   "parts": []
  },
  "closure-value": {
   "id": "closure-value",
   "name": "Closure value",
   "area": "swift",
   "first": "Two addresses: one for the closure's code, and one for its context.",
   "parts": [
    "closure-code",
    "context"
   ],
   "dependsOn": [
    {
     "id": "closure",
     "views": [
      "what",
      "memory"
     ],
     "why": "A closure value is what a constant holds when it holds a closure."
    },
    {
     "id": "heap-object",
     "views": [
      "what",
      "memory"
     ],
     "why": "The context of a closure value is a heap object."
    },
    {
     "id": "stack-frame",
     "views": [
      "memory"
     ],
     "why": "Its steps show the stack frame of the function that makes the closure, which is removed when that function returns."
    }
   ],
   "example": {
    "code": [
     "func makeGreeter() -> (String) -> Void {",
     "    let greeting = \"Hello\"",
     "    return { (name: String) in",
     "        print(\"\\(greeting), \\(name)\")",
     "    }",
     "}",
     "let greet = makeGreeter()",
     "greet(\"Ana\")"
    ],
    "probes": [
     {
      "after": 2,
      "print": "greeting",
      "values": [
       "Hello"
      ]
     }
    ],
    "sil": [
     {
      "in": "makeGreeter()",
      "has": "partial_apply [callee_guaranteed]",
      "shows": "Line 3 makes the closure's context on the heap, from greeting."
     },
     {
      "in": "closure #1 in makeGreeter()",
      "has": "%1 : @closureCapture $String",
      "shows": "The closure's code gets greeting from its context."
     }
    ]
   },
   "views": {
    "what": {
     "is": "A closure value is what a constant holds when it holds a closure: two addresses. The first is the address of the closure's code. The second is the address of the closure's context: a heap object that holds what the closure captured.",
     "marks": [
      {
       "line": 3,
       "text": "{",
       "part": "closure-code",
       "label": "the closure's code"
      },
      {
       "line": 7,
       "text": "greet",
       "label": "a closure value"
      }
     ],
     "figure": {
      "panes": [
       {
        "title": "After line 7",
        "step": 4
       }
      ],
      "caption": {
       "title": "What `greet` holds:",
       "text": "the address of the closure's code, and the address of its context."
      }
     },
     "problem": "A closure can be called after the function that made it has returned, from any code that has the closure. So its code and what it captured must stay together, in one value that a constant can hold.",
     "how": "Calling `greet` runs the code at the first address, and passes it the context at the second address. That is how the body finds `greeting` after `makeGreeter()` has returned."
    },
    "memory": {
     "question": "How does the body find `greeting` after `makeGreeter()` has returned?",
     "steps": [
      {
       "text": "Line 7 calls `makeGreeter()`. A stack frame is made for the call.",
       "line": 7,
       "blocks": [
        {
         "id": "mg",
         "kind": "frame",
         "title": "makeGreeter()",
         "fields": [
          [
           "greeting",
           null
          ]
         ]
        },
        {
         "id": "code",
         "kind": "code",
         "title": "the closure's code",
         "tag": "lines 3 to 5",
         "text": "print(…)"
        }
       ],
       "highlight": [
        "mg"
       ]
      },
      {
       "text": "Line 2 sets `greeting` to `\"Hello\"`, in the frame.",
       "line": 2,
       "blocks": [
        {
         "id": "mg",
         "kind": "frame",
         "title": "makeGreeter()",
         "fields": [
          [
           "greeting",
           "\"Hello\""
          ]
         ]
        },
        {
         "id": "code",
         "kind": "code",
         "title": "the closure's code",
         "tag": "lines 3 to 5",
         "text": "print(…)"
        }
       ],
       "highlight": [
        "mg"
       ]
      },
      {
       "text": "Line 3 makes the closure. Its context is made on the heap, and holds `greeting`.",
       "line": 3,
       "also": [
        4,
        5
       ],
       "blocks": [
        {
         "id": "mg",
         "kind": "frame",
         "title": "makeGreeter()",
         "fields": [
          [
           "greeting",
           "\"Hello\""
          ]
         ]
        },
        {
         "id": "ctx",
         "kind": "heap",
         "title": "context",
         "fields": [
          [
           "greeting",
           "\"Hello\""
          ]
         ]
        },
        {
         "id": "code",
         "kind": "code",
         "title": "the closure's code",
         "tag": "lines 3 to 5",
         "text": "print(…)"
        }
       ],
       "highlight": [
        "ctx"
       ]
      },
      {
       "text": "Line 3 returns the closure, and the frame is removed. Line 7 stores the closure value in `greet`: the address of the closure's code, and the address of its context.",
       "line": 7,
       "also": [
        3
       ],
       "blocks": [
        {
         "id": "mg",
         "kind": "removed",
         "title": "makeGreeter()",
         "text": "its frame is gone"
        },
        {
         "id": "greet",
         "kind": "global",
         "title": "greet",
         "tag": "closure value",
         "fields": [
          [
           "code",
           {
            "to": "code"
           }
          ],
          [
           "context",
           {
            "to": "ctx"
           }
          ]
         ]
        },
        {
         "id": "ctx",
         "kind": "heap",
         "title": "context",
         "fields": [
          [
           "greeting",
           "\"Hello\""
          ]
         ]
        },
        {
         "id": "code",
         "kind": "code",
         "title": "the closure's code",
         "tag": "lines 3 to 5",
         "text": "print(…)"
        }
       ],
       "highlight": [
        "greet"
       ]
      },
      {
       "text": "Line 8 calls `greet` with `\"Ana\"`. The code at the first address runs, with the context at the second address, so the body finds `greeting` and prints {{Hello, Ana}}.",
       "line": 8,
       "also": [
        4
       ],
       "prints": [
        "Hello, Ana"
       ],
       "blocks": [
        {
         "id": "mg",
         "kind": "removed",
         "title": "makeGreeter()",
         "text": "its frame is gone"
        },
        {
         "id": "greet",
         "kind": "global",
         "title": "greet",
         "tag": "closure value",
         "fields": [
          [
           "code",
           {
            "to": "code"
           }
          ],
          [
           "context",
           {
            "to": "ctx"
           }
          ]
         ]
        },
        {
         "id": "ctx",
         "kind": "heap",
         "title": "context",
         "fields": [
          [
           "greeting",
           "\"Hello\""
          ]
         ]
        },
        {
         "id": "code",
         "kind": "code",
         "title": "the closure's code",
         "tag": "lines 3 to 5",
         "text": "print(…)"
        }
       ],
       "highlight": [
        "ctx",
        "code"
       ]
      }
     ],
     "answer": "The context is a heap object, so it stays after `makeGreeter()` returns, and `greet` holds its address."
    }
   }
  },
  "closure": {
   "id": "closure",
   "name": "Closure",
   "area": "swift",
   "first": "A function with no name, written between braces.",
   "parts": [
    "braces",
    "parameter-list",
    "in-keyword",
    "body",
    "capture"
   ],
   "dependsOn": [
    {
     "id": "function",
     "views": [
      "what",
      "parts"
     ],
     "why": "A closure is a function with no name, so it has a parameter list and a body, and its body runs when it is called."
    }
   ],
   "example": {
    "code": [
     "func sayHello() {",
     "    let greeting = \"Hello\"",
     "    let greet = { (name: String) in",
     "        print(\"\\(greeting), \\(name)\")",
     "    }",
     "    greet(\"Ana\")",
     "    greet(\"Bo\")",
     "}",
     "sayHello()"
    ]
   },
   "snippets": {
    "map": {
     "code": [
      "let doubled = [1, 2, 3].map { (n: Int) in n * 2 }",
      "print(doubled)  // [2, 4, 6]"
     ],
     "output": [
      "[2, 4, 6]"
     ]
    }
   },
   "views": {
    "what": {
     "is": "A closure is a function with no name, written between braces. It can be stored in a constant, such as `greet`, and called later.",
     "marks": [
      {
       "line": 3,
       "text": "{",
       "part": "braces",
       "label": "braces"
      },
      {
       "line": 5,
       "text": "}",
       "part": "braces"
      }
     ],
     "problem": "Some code is not run where it is written. It is handed to other code, which runs it later, or many times. A closure lets you write that code right where it is handed over, without naming a separate function.",
     "how": "Writing a closure does not run its body. It makes a value, which `greet` holds, and the body runs each time that value is called: line 6 runs it once, and line 7 runs it again.",
     "when": [
      {
       "text": "Use one when you hand code to a function that runs it, such as `map`, which runs the closure once for each item:",
       "snippet": "map"
      },
      {
       "text": "Don't use one when the code is a job of its own, which other code calls by its name. Then write a function with `func`, as `sayHello()` is."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "braces",
       "name": "The braces, `{` and `}`",
       "text": "The closure starts at `{` on line 3 and ends at the matching `}` on line 5. Everything between them belongs to the closure."
      },
      {
       "part": "parameter-list",
       "name": "The parameter list, `(name: String)`",
       "text": "The inputs that the closure takes. `name` is a parameter, and `String` is its type."
      },
      {
       "part": "in-keyword",
       "name": "`in`",
       "text": "It ends the parameter list. The body comes after it."
      },
      {
       "part": "body",
       "name": "The body",
       "text": "The code that runs each time the closure is called. Here it prints a greeting."
      },
      {
       "part": "capture",
       "name": "Capture, the last part",
       "text": "The body uses `greeting`, which is declared on line 2, outside the braces. A closure captures each constant and variable from outside its braces that its body uses: it keeps `greeting`, so the body can use it each time it runs."
      }
     ],
     "marks": [
      {
       "line": 2,
       "text": "greeting",
       "part": "capture",
       "label": "declared outside the braces"
      },
      {
       "line": 3,
       "text": "{",
       "part": "braces",
       "label": "braces"
      },
      {
       "line": 3,
       "text": "(name: String)",
       "part": "parameter-list",
       "label": "parameter list"
      },
      {
       "line": 3,
       "text": "in",
       "part": "in-keyword"
      },
      {
       "line": 4,
       "text": "print(\"\\(greeting), \\(name)\")",
       "part": "body",
       "label": "body"
      },
      {
       "line": 4,
       "text": "greeting",
       "part": "capture",
       "label": "used in the body"
      },
      {
       "line": 5,
       "text": "}",
       "part": "braces"
      }
     ],
     "steps": [
      {
       "text": "Line 9 calls `sayHello()`.",
       "line": 9
      },
      {
       "text": "Line 2 sets `greeting` to `\"Hello\"`.",
       "line": 2
      },
      {
       "text": "Line 3 stores the closure in `greet`. The body, on line 4, does not run.",
       "line": 3,
       "dim": [
        4
       ]
      },
      {
       "text": "Line 6 calls `greet` with the argument `\"Ana\"`. The body runs with `name` set to `\"Ana\"`, and prints {{Hello, Ana}}.",
       "line": 6,
       "also": [
        4
       ],
       "value": {
        "line": 4,
        "name": "name",
        "is": "\"Ana\""
       },
       "prints": [
        "Hello, Ana"
       ]
      },
      {
       "text": "Line 7 calls `greet` with `\"Bo\"`, and the body prints {{Hello, Bo}}.",
       "line": 7,
       "also": [
        4
       ],
       "value": {
        "line": 4,
        "name": "name",
        "is": "\"Bo\""
       },
       "prints": [
        "Hello, Bo"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "`greet` holds the closure: its code, and the `greeting` that it captured. The body runs each time `greet` is called, not where it is written."
     }
    }
   }
  },
  "context": {
   "id": "context",
   "name": "Context",
   "first": "A heap object that holds what a closure captured.",
   "parts": []
  },
  "declared-outside": {
   "id": "declared-outside",
   "name": "Declared outside the braces",
   "first": "A constant or variable declared in the code around a closure, before its opening brace.",
   "parts": []
  },
  "func-keyword": {
   "id": "func-keyword",
   "name": "func",
   "first": "The word that starts the declaration of a function.",
   "parts": []
  },
  "function-name": {
   "id": "function-name",
   "name": "Function name",
   "first": "The name that a call uses to run a function.",
   "parts": []
  },
  "function": {
   "id": "function",
   "name": "Function",
   "area": "swift",
   "first": "A named block of code that takes inputs and can return a value.",
   "parts": [
    "func-keyword",
    "function-name",
    "parameter-list",
    "return-type",
    "body",
    "return-statement",
    "call"
   ],
   "dependsOn": [],
   "example": {
    "code": [
     "func greet(name: String) -> String {",
     "    return \"Hello, \\(name)\"",
     "}",
     "let message = greet(name: \"Ana\")",
     "print(message)"
    ]
   },
   "snippets": {
    "twice": {
     "code": [
      "func greet(name: String) -> String {",
      "    return \"Hello, \\(name)\"",
      "}",
      "print(greet(name: \"Ana\"))  // Hello, Ana",
      "print(greet(name: \"Bo\"))   // Hello, Bo"
     ],
     "output": [
      "Hello, Ana",
      "Hello, Bo"
     ]
    },
    "map": {
     "code": [
      "let doubled = [1, 2, 3].map { (n: Int) in n * 2 }",
      "print(doubled)  // [2, 4, 6]"
     ],
     "output": [
      "[2, 4, 6]"
     ]
    }
   },
   "views": {
    "what": {
     "is": "A function is a block of code with a name. You declare it once, with `func`, and run it by calling its name. It can take inputs, called parameters, and it can return a value.",
     "marks": [
      {
       "line": 1,
       "text": "func",
       "part": "func-keyword"
      },
      {
       "line": 1,
       "text": "(name: String)",
       "part": "parameter-list",
       "label": "parameters"
      },
      {
       "line": 1,
       "text": "-> String",
       "part": "return-type",
       "label": "returns"
      }
     ],
     "afterExample": "Lines 1 to 3 declare a function named `greet`. Line 4 calls it, and `message` holds the value that it returns.",
     "problem": "The same work is often needed in more than one place, with different values. A function lets you write that work once, and run it from each place with the values that place gives it.",
     "how": "Declaring `greet` does not run its body. The call on line 4 runs the body, with the parameter `name` set to the argument `\"Ana\"`. The call ends at `return`, and gives back the value after it.",
     "when": [
      {
       "text": "Use one when the same work is needed in more than one place, or when a piece of work has one job that you can name. Each call runs the same body with its own argument:",
       "snippet": "twice"
      },
      {
       "text": "Don't use one when the code is handed to another function to run, such as the code that `map` runs once for each item. There, write a closure instead: a function with no name, written right where it is handed over.",
       "snippet": "map"
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "func-keyword",
       "name": "`func`",
       "text": "The word `func` starts the declaration of a function, on line 1."
      },
      {
       "part": "function-name",
       "name": "The name, `greet`",
       "text": "`greet` is the function's name. A call uses this name to run the function, as line 4 does."
      },
      {
       "part": "parameter-list",
       "name": "The parameter list, `(name: String)`",
       "text": "The inputs that the function takes, in parentheses. `name` is a parameter, and `String` is its type. Inside the body, `name` holds the value that the call gave it."
      },
      {
       "part": "return-type",
       "name": "The return type, `-> String`",
       "text": "The type of the value that the function gives back. `greet` gives back a `String`."
      },
      {
       "part": "body",
       "name": "The body",
       "text": "The code between `{` on line 1 and `}` on line 3. It runs each time the function is called."
      },
      {
       "part": "return-statement",
       "name": "`return`",
       "text": "`return` on line 2 ends the call, and gives back the value after it. That value must have the return type, `String`."
      },
      {
       "part": "call",
       "name": "The call, on line 4",
       "text": "Line 4 calls `greet`. In the parentheses, `name:` is the argument label: it says which parameter the value is for. `\"Ana\"` is the argument: the value that the parameter `name` gets. Its type must be the parameter's type, `String`."
      }
     ],
     "marks": [
      {
       "line": 1,
       "text": "func",
       "part": "func-keyword"
      },
      {
       "line": 1,
       "text": "greet",
       "part": "function-name",
       "label": "name"
      },
      {
       "line": 1,
       "text": "(name: String)",
       "part": "parameter-list",
       "label": "parameter list"
      },
      {
       "line": 1,
       "text": "-> String",
       "part": "return-type",
       "label": "return type"
      },
      {
       "line": 2,
       "text": "return \"Hello, \\(name)\"",
       "part": "body",
       "label": "body"
      },
      {
       "line": 2,
       "text": "return",
       "part": "return-statement"
      },
      {
       "line": 4,
       "text": "name:",
       "part": "call",
       "label": "argument label"
      },
      {
       "line": 4,
       "text": "\"Ana\"",
       "part": "call",
       "label": "argument"
      }
     ],
     "steps": [
      {
       "text": "Line 4 calls `greet` with the argument `\"Ana\"`.",
       "line": 4
      },
      {
       "text": "The body runs, with `name` set to `\"Ana\"`. Line 2 returns the string \"Hello, Ana\", and the call ends.",
       "line": 2,
       "value": {
        "line": 2,
        "name": "name",
        "is": "\"Ana\""
       }
      },
      {
       "text": "Line 4 stores the returned string in `message`.",
       "line": 4,
       "value": {
        "line": 4,
        "name": "message",
        "is": "\"Hello, Ana\""
       }
      },
      {
       "text": "Line 5 prints {{Hello, Ana}}.",
       "line": 5,
       "prints": [
        "Hello, Ana"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "`greet` runs only when it is called. Each call gives `name` the argument of that call, and gives back the value after `return`."
     }
    }
   }
  },
  "heap-object": {
   "id": "heap-object",
   "name": "Heap object",
   "area": "memory",
   "first": "Memory on the heap, found by its address.",
   "parts": [],
   "dependsOn": [
    {
     "id": "stack-frame",
     "views": [
      "what",
      "memory"
     ],
     "why": "A heap object stays after the call that made it returns, and a stack frame does not."
    }
   ],
   "example": {
    "code": [
     "final class Score {",
     "    var points = 0",
     "}",
     "func makeScore() -> Score {",
     "    let score = Score()",
     "    return score",
     "}",
     "let mine = makeScore()"
    ],
    "probes": [
     {
      "after": 5,
      "print": "score.points",
      "values": [
       "0"
      ]
     },
     {
      "after": 8,
      "print": "mine.points",
      "values": [
       "0"
      ]
     }
    ],
    "sil": [
     {
      "in": "Score.__allocating_init()",
      "has": "alloc_ref $Score",
      "shows": "Score() makes its object on the heap."
     },
     {
      "in": "makeScore()",
      "lacks": "alloc_box",
      "shows": "score holds the object's address, and is not itself kept on the heap."
     }
    ]
   },
   "views": {
    "what": {
     "is": "The heap is memory that does not belong to any one call, so it is not removed when a call returns. A heap object is one piece of the heap, made while the program runs, and found by its address.",
     "marks": [
      {
       "line": 5,
       "text": "score",
       "label": "an address"
      },
      {
       "line": 5,
       "text": "Score()",
       "label": "a heap object"
      },
      {
       "line": 8,
       "text": "mine",
       "label": "the same address"
      }
     ],
     "figure": {
      "panes": [
       {
        "title": "After line 5",
        "step": 2
       },
       {
        "title": "After makeScore() returns",
        "step": 3
       }
      ],
      "caption": {
       "title": "A `Score` object on the heap,",
       "text": "while `makeScore()` runs, and after it returns."
      }
     },
     "afterExample": "`Score()` on line 5 makes a heap object. `score` does not hold the object itself: it holds the object's address.",
     "problem": "Some values must stay after the call that made them returns, and be used from more than one place. A stack frame cannot keep them, because it is removed when its call returns.",
     "how": "A heap object stays while something holds its address. When `makeScore()` returns, `score` is removed with its frame, but `mine` holds the same address, so the object stays."
    },
    "memory": {
     "question": "`score` is removed when `makeScore()` returns. What happens to the `Score` object?",
     "steps": [
      {
       "text": "Line 8 calls `makeScore()`. A stack frame is made for the call. `score` has no value yet.",
       "line": 8,
       "blocks": [
        {
         "id": "ms",
         "kind": "frame",
         "title": "makeScore()",
         "fields": [
          [
           "score",
           null
          ]
         ]
        }
       ],
       "highlight": [
        "ms"
       ]
      },
      {
       "text": "Line 5 makes a `Score` object on the heap, with `points` set to 0. `score`, in the frame, holds its address.",
       "line": 5,
       "also": [
        2
       ],
       "blocks": [
        {
         "id": "ms",
         "kind": "frame",
         "title": "makeScore()",
         "fields": [
          [
           "score",
           {
            "to": "obj"
           }
          ]
         ]
        },
        {
         "id": "obj",
         "kind": "heap",
         "title": "Score",
         "fields": [
          [
           "points",
           "0"
          ]
         ]
        }
       ],
       "highlight": [
        "obj"
       ]
      },
      {
       "text": "Line 6 returns `score`, and the frame is removed, so `score` no longer exists. Line 8 stores the returned address in `mine`. The object stays, because `mine` holds its address.",
       "line": 6,
       "also": [
        8
       ],
       "blocks": [
        {
         "id": "ms",
         "kind": "removed",
         "title": "makeScore()",
         "text": "score is gone"
        },
        {
         "id": "mine",
         "kind": "global",
         "title": "mine",
         "tag": "constant",
         "fields": [
          [
           "mine",
           {
            "to": "obj"
           }
          ]
         ]
        },
        {
         "id": "obj",
         "kind": "heap",
         "title": "Score",
         "fields": [
          [
           "points",
           "0"
          ]
         ]
        }
       ],
       "highlight": [
        "mine"
       ]
      }
     ],
     "answer": "The object stays, because `mine` holds its address. A heap object stays while something holds its address."
    }
   }
  },
  "in-keyword": {
   "id": "in-keyword",
   "name": "in",
   "first": "The word that ends a closure's parameter list. The body comes after it.",
   "parts": []
  },
  "local-value": {
   "id": "local-value",
   "name": "Local constant or variable",
   "first": "A constant or variable declared inside a function's body.",
   "parts": []
  },
  "parameter-list": {
   "id": "parameter-list",
   "name": "Parameter list",
   "first": "The inputs that a function or closure takes, in parentheses, each with a name and a type.",
   "parts": [
    "parameter"
   ]
  },
  "parameter": {
   "id": "parameter",
   "name": "Parameter",
   "first": "One input of a function or closure: a name, a colon, and the type of the value it holds.",
   "parts": []
  },
  "return-statement": {
   "id": "return-statement",
   "name": "return",
   "first": "The word that ends a call, and gives back the value written after it.",
   "parts": []
  },
  "return-type": {
   "id": "return-type",
   "name": "Return type",
   "first": "The type of the value that a function gives back, written after an arrow.",
   "parts": []
  },
  "stack-frame": {
   "id": "stack-frame",
   "name": "Stack frame",
   "area": "memory",
   "first": "The memory made for one function call.",
   "parts": [
    "parameter",
    "local-value"
   ],
   "dependsOn": [
    {
     "id": "function",
     "views": [
      "what",
      "memory"
     ],
     "why": "A stack frame is the memory made for one call of a function."
    }
   ],
   "example": {
    "code": [
     "func double(_ n: Int) -> Int {",
     "    let result = n * 2",
     "    return result",
     "}",
     "let answer = double(4)"
    ],
    "probes": [
     {
      "after": 1,
      "print": "n",
      "values": [
       "4"
      ]
     },
     {
      "after": 2,
      "print": "result",
      "values": [
       "8"
      ]
     },
     {
      "after": 5,
      "print": "answer",
      "values": [
       "8"
      ]
     }
    ],
    "sil": [
     {
      "in": "double(_:)",
      "lacks": "alloc_box",
      "shows": "double(_:) keeps nothing in a box on the heap."
     },
     {
      "in": "double(_:)",
      "lacks": "alloc_ref",
      "shows": "double(_:) makes no object on the heap."
     }
    ]
   },
   "views": {
    "what": {
     "is": "A stack frame is the memory made for one call of a function. It holds that call's parameters, and its local constants and variables.",
     "marks": [
      {
       "line": 1,
       "text": "n",
       "part": "parameter",
       "label": "parameter"
      },
      {
       "line": 2,
       "text": "result",
       "part": "local-value",
       "label": "local constant"
      },
      {
       "line": 5,
       "text": "double(4)",
       "part": "call",
       "label": "the call"
      }
     ],
     "figure": {
      "panes": [
       {
        "title": "After line 2",
        "step": 2
       },
       {
        "title": "After double(4) returns",
        "step": 4
       }
      ],
      "caption": {
       "title": "The stack frame of `double(4)`,",
       "text": "while the call runs, and after it returns."
      }
     },
     "afterExample": "While `double(4)` runs, its frame holds `n`, which is 4, and `result`, which is 8.",
     "problem": "Each call of a function needs its own place for its parameters and local values, so that two calls never change each other's values.",
     "how": "The frame is made when the call starts, and removed when the call returns. After `double(4)` returns, `n` and `result` no longer exist. Only the returned value, 8, is kept, in `answer`."
    },
    "memory": {
     "question": "Where are `n` and `result` while `double(4)` runs, and what happens to them when it returns?",
     "steps": [
      {
       "text": "Line 5 calls `double(4)`. A stack frame is made for the call, and `n` in it is 4.",
       "line": 5,
       "blocks": [
        {
         "id": "d",
         "kind": "frame",
         "title": "double(_:)",
         "fields": [
          [
           "n",
           "4"
          ]
         ]
        }
       ],
       "highlight": [
        "d"
       ]
      },
      {
       "text": "Line 2 sets `result` to 8, in the same frame.",
       "line": 2,
       "blocks": [
        {
         "id": "d",
         "kind": "frame",
         "title": "double(_:)",
         "fields": [
          [
           "n",
           "4"
          ],
          [
           "result",
           "8"
          ]
         ]
        }
       ],
       "highlight": [
        "d"
       ]
      },
      {
       "text": "Line 3 returns `result`, and the frame is removed. `n` and `result` no longer exist.",
       "line": 3,
       "blocks": [
        {
         "id": "d",
         "kind": "removed",
         "title": "double(_:)",
         "text": "n and result are gone"
        }
       ],
       "highlight": []
      },
      {
       "text": "Line 5 stores the returned 8 in `answer`.",
       "line": 5,
       "blocks": [
        {
         "id": "d",
         "kind": "removed",
         "title": "double(_:)",
         "text": "n and result are gone"
        },
        {
         "id": "answer",
         "kind": "global",
         "title": "answer",
         "tag": "constant",
         "fields": [
          [
           "answer",
           "8"
          ]
         ]
        }
       ],
       "highlight": [
        "answer"
       ]
      }
     ],
     "answer": "A value in a stack frame exists only until its call returns."
    }
   }
  },
  "stack": {
   "id": "stack",
   "name": "Stack",
   "first": "The memory of one thread, which holds a stack frame for each call that the thread is running.",
   "parts": []
  },
  "suspension-point": {
   "id": "suspension-point",
   "name": "Suspension point",
   "first": "A place where code can suspend: stop running, and free its thread, until the call it waits for returns. Each await marks one.",
   "parts": []
  },
  "thread": {
   "id": "thread",
   "name": "Thread",
   "area": "conc",
   "first": "One sequence of instructions that the processor runs, one after another, with its own stack.",
   "parts": [
    "stack"
   ],
   "dependsOn": [
    {
     "id": "stack-frame",
     "views": [
      "what"
     ],
     "why": "Each thread has its own stack, which holds a stack frame for each call that the thread is running."
    }
   ],
   "example": {
    "code": [
     "import Foundation",
     "let helper = Thread {",
     "    print(\"The helper thread runs this\")",
     "}",
     "helper.start()",
     "Thread.sleep(forTimeInterval: 1)",
     "print(\"The main thread runs this\")"
    ],
    "output": [
     "The helper thread runs this",
     "The main thread runs this"
    ]
   },
   "views": {
    "what": {
     "is": "A thread is one sequence of instructions that the processor runs, one after another. A program can have many threads, and they can run at the same time. Each thread has its own stack: the memory that holds a stack frame for each call that the thread is running.",
     "marks": [
      {
       "line": 2,
       "text": "Thread",
       "label": "a second thread"
      },
      {
       "line": 7,
       "text": "print(\"The main thread runs this\")",
       "label": "runs on the main thread"
      }
     ],
     "afterExample": "The program starts with one thread, the main thread, which runs the top-level code. Line 2 makes a second thread, `helper`, and line 5 starts it. `helper` runs the closure on lines 2 to 4, while the main thread goes on to line 6.",
     "problem": "A thread does one thing at a time, in order. A program that has to do two things at once, such as draw its screen while it reads a file, needs a thread for each of them.",
     "how": "The system decides when each thread runs, and on which core of the processor. Line 6 makes the main thread wait for one second, and it runs nothing while it waits. In that second, `helper` prints {{The helper thread runs this}}. Then the main thread prints {{The main thread runs this}}.",
     "when": [
      {
       "text": "You seldom make a thread yourself, as line 2 does. Swift and Apple's frameworks run your code on threads that they choose. An app draws its screen on the main thread, so code that runs on the main thread must not wait for long, or the screen stops responding."
      }
     ]
    }
   }
  },
  "used-in-body": {
   "id": "used-in-body",
   "name": "Used in the body",
   "first": "A place where a closure's body uses a constant or variable that is declared outside its braces.",
   "parts": []
  },
  "variable-outside-closure": {
   "id": "variable-outside-closure",
   "name": "Variable outside the closure",
   "first": "A variable declared in the code around a closure, which the closure's body can change.",
   "parts": []
  },
  "variable-used-in-body": {
   "id": "variable-used-in-body",
   "name": "Variable used in the body",
   "first": "A place where a closure's body changes or reads a variable from outside its braces. It is the same variable, not a copy.",
   "parts": []
  }
 },
 "known": [
  "function",
  "closure"
 ]
};
