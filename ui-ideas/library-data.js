// Made by library/build.js from concepts/, known.json, and planned.json. Do not edit it: change those files, and run node library/build.js.
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
     "is": "An async function is a function that can suspend: stop partway through its body, free its thread, and go on later from the same place. Swift's documentation calls it an asynchronous function. You write `async` in its declaration, and `await` where it is called.",
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
     "problem": "Some work has to wait: for data from the network, for a file, or for a timer. A synchronous function, one without `async`, keeps its thread the whole time it waits, so the thread can run nothing else. When that thread is the main thread, the app's screen stops responding until the wait ends.",
     "how": "An async function can suspend only at an `await`. While it is suspended, it does not use its thread, so the thread is free to run other code. When the call after `await` returns, the function goes on from there, and its constants and variables still hold their values.",
     "when": [
      {
       "text": "Use one when a function has to wait for something, such as data from the network, a file, or a timer. Many functions that wait for these, in Swift's standard library and in Apple's frameworks, are async functions, such as `Task.sleep`. Code can call them with `await` only where it can suspend, such as in an async function."
      },
      {
       "text": "Don't use one to run two pieces of work at the same time. The code that calls an async function with `await` waits until it returns, as line 8 waits for `makeTea(cups:)`. Work that runs at the same time as other work is a task."
      },
      {
       "text": "Don't make a function async when it never waits. Code calls an async function with `await`, and only where it can suspend. `double(_:)` never waits, so it is a synchronous function, and any code can call it:",
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
       "text": "The keyword `async`, on line 1, makes `makeTea(cups:)` an async function: a function that can suspend. It is written after the parameter list, before the return arrow, `->`."
      },
      {
       "part": "await",
       "name": "`await`",
       "text": "`await` is a keyword, written before a call of an async function. Line 4 calls `Task.sleep(for: .seconds(1))`, an async method of the `Task` type in Swift's standard library, which waits for the time it is given. Line 8 calls `makeTea(cups: 2)`. Without `await`, neither call builds. `await` can be written only in code that can suspend, which Swift's documentation calls an asynchronous context, such as the body of an async function, as on line 4, or the top level of a program's main file, as on line 8. Line 4 also has `try?`, because `Task.sleep(for: .seconds(1))` can throw an error: if it throws, `try?` makes the result nil, and line 4 goes on. Swift's rules put `try?` before `await`, and swiftc warns when it comes after."
      },
      {
       "part": "suspension-point",
       "name": "Suspension points, on lines 4 and 8",
       "text": "Each `await` marks a suspension point: a place where the code can suspend. Swift's documentation calls it a possible suspension point, because the code can suspend there, but does not have to. To suspend is to stop running, and free the thread, until the call after `await` returns. At line 4, `makeTea(cups:)` can suspend while `Task.sleep(for: .seconds(1))` waits. At line 8, the top-level code can suspend until `makeTea(cups:)` returns. In this program, these are the only two places where code can suspend, and both are marked with `await`."
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
   "first": "The keyword, written after a function's parameter list, that makes it an async function.",
   "parts": []
  },
  "await": {
   "id": "await",
   "name": "await",
   "first": "The keyword written before a call of an async function. It can be written only in code that can suspend.",
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
   "first": "A closure keeps each constant and variable from the function around it that its body uses.",
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
     "why": "Capture is what a closure does with a constant or variable from the function around it that its body uses."
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
     "is": "Capture is what a closure does with a constant or variable that is declared in the function around it, outside its braces, and used in its body: the closure keeps it, so the body can use it each time the closure runs.",
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
       "text": "Capture happens on its own, whenever the body uses a constant or variable from the function around the closure. So the choice is between a captured value and a parameter. A captured value, such as `greeting`, is the same at every call. A parameter, such as `name`, gets a new value from each call."
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
       "text": "The body uses `greeting` on line 4. Each constant or variable that the body uses, and that is declared in `sayHello()` outside the braces, is one that the closure captures."
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
   "first": "A constant from the function around a closure, such as one of that function's parameters, that the closure's body uses. The body can read it, but not change it.",
   "parts": []
  },
  "captured-variables": {
   "id": "captured-variables",
   "name": "Captured variables",
   "area": "memory",
   "first": "A variable, declared in the function around a closure, that the closure's body uses.",
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
     "is": "A captured variable is a variable, declared in the function around a closure, that the closure's body uses. The closure uses that same variable, not a copy of it.",
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
   "first": "A function with no name, written between braces, which Swift's documentation calls a closure expression.",
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
     "is": "A closure is a function with no name, written between braces. Swift's documentation calls this form a closure expression. It can be stored in a constant, such as `greet`, and called later.",
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
       "text": "`in` is a keyword: a word that Swift reserves for its own use, as it does `func` and `let`. It ends the parameter list, and the body comes after it."
      },
      {
       "part": "body",
       "name": "The body",
       "text": "The code that runs each time the closure is called. Here it prints a greeting."
      },
      {
       "part": "capture",
       "name": "Capture, the last part",
       "text": "The body uses `greeting`, which is declared on line 2, in `sayHello()` but outside the braces. A closure captures each constant and variable from the function around it that its body uses: it keeps `greeting`, so the body can use it each time it runs."
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
  "conformance": {
   "id": "conformance",
   "name": "Conformance",
   "first": "A type's statement, written as a protocol's name after a colon, that it has everything the protocol requires.",
   "parts": []
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
   "first": "A constant or variable declared in the function around a closure, before the closure's opening brace.",
   "parts": []
  },
  "dollar-sign": {
   "id": "dollar-sign",
   "name": "Dollar sign",
   "first": "The dollar sign written before the name of a wrapped property, which reads the wrapper's projected value in place of its wrapped value.",
   "parts": []
  },
  "func-keyword": {
   "id": "func-keyword",
   "name": "func",
   "first": "The keyword that declares a function. The function's name comes right after it.",
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
   "first": "A named block of code that can take inputs and can return a value.",
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
       "text": "`func` is a keyword: a word that Swift reserves for its own use, as it does `let` and `return`. On line 1, `func` declares a function, and the function's name comes right after it."
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
       "name": "The return type, `String`",
       "text": "`->` is the return arrow. The type after it is the type of the value that the function gives back, so `greet` gives back a `String`."
      },
      {
       "part": "body",
       "name": "The body",
       "text": "The code between `{` on line 1 and `}` on line 3. It runs each time the function is called."
      },
      {
       "part": "return-statement",
       "name": "`return`",
       "text": "Line 2 is a return statement: the keyword `return`, then the value to give back. It ends the call, and gives back that value, which must have the return type, `String`."
      },
      {
       "part": "call",
       "name": "The call, on line 4",
       "text": "Line 4 calls `greet`. In the parentheses, `name:` is the argument label: it says which parameter the value is for. A parameter's name is also its argument label, unless the declaration gives it a different label or none, so the label here is `name`. `\"Ana\"` is the argument: the value that the parameter `name` gets. Its type must be the parameter's type, `String`."
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
  "generic-parameter-clause": {
   "id": "generic-parameter-clause",
   "name": "Generic parameter clause",
   "first": "The angle brackets after a function or type name that set up placeholder types, so the code works with many types instead of just one.",
   "parts": [
    "type-parameter",
    "type-constraint"
   ]
  },
  "generics": {
   "id": "generics",
   "name": "Generics",
   "area": "swift",
   "first": "Code written once, as a function or a type, that works with every type that meets the requirements it states.",
   "parts": [
    "generic-parameter-clause",
    "type-argument"
   ],
   "dependsOn": [
    {
     "id": "function",
     "views": [
      "what",
      "parts"
     ],
     "why": "A generic function is a function with a generic parameter clause after its name, and each call gives its type parameters types, as it gives its parameters values.",
     "whyInExample": "`largest(_:_:)` is declared with `func`, as `greet` is. It has a name, two parameters, a return type, and a body. Its `T` is a parameter too: each call gives `T` a type, as `greet(name: \"Ana\")` gives `name` a value."
    },
    {
     "id": "protocol",
     "views": [
      "what",
      "parts",
      "memory"
     ],
     "why": "A type constraint requires every type that a type parameter gets to conform to a protocol.",
     "whyInExample": "`: Comparable` on line 1 requires every type that `T` gets to conform to `Comparable`, a protocol in Swift's standard library."
    },
    {
     "id": "stack-frame",
     "views": [
      "memory"
     ],
     "why": "Each call of a generic function gets a stack frame, which holds the addresses of its values, and of what Swift keeps about their type.",
     "whyInExample": "Each call of `largest(_:_:)` gets a stack frame. It holds the addresses of `a` and `b`, and two hidden arguments about `T`."
    }
   ],
   "example": {
    "code": [
     "func largest<T: Comparable>(_ a: T, _ b: T) -> T {",
     "    if a > b {",
     "        return a",
     "    }",
     "    return b",
     "}",
     "let cups: Int = largest(3, 8)",
     "let name: String = largest(\"Bo\", \"Ana\")",
     "print(cups)  // 8",
     "print(name)  // Bo"
    ],
    "probes": [
     {
      "after": 1,
      "print": "T.self",
      "values": [
       "Int",
       "String"
      ]
     },
     {
      "after": 1,
      "print": "MemoryLayout<T>.size",
      "values": [
       "8",
       "16"
      ]
     },
     {
      "after": 1,
      "print": "a",
      "values": [
       "3",
       "Bo"
      ]
     },
     {
      "after": 1,
      "print": "b",
      "values": [
       "8",
       "Ana"
      ]
     },
     {
      "after": 7,
      "print": "cups",
      "values": [
       "8"
      ]
     },
     {
      "after": 8,
      "print": "name",
      "values": [
       "Bo"
      ]
     }
    ],
    "sil": [
     {
      "in": "largest<A>(_:_:)",
      "has": "<T where T : Comparable> (@in_guaranteed T, @in_guaranteed T) -> @out T",
      "shows": "largest(_:_:) gets a and b by their addresses, and puts its result at an address that the call gives it."
     },
     {
      "in": "largest<A>(_:_:)",
      "has": "witness_method $T, #Comparable.\">\"",
      "shows": "Line 2 finds > in the witness table of T for Comparable."
     }
    ],
    "ir": [
     {
      "in": "largest<A>(_:_:)",
      "has": "(ptr noalias sret(%swift.opaque) %0, ptr noalias %1, ptr noalias %2, ptr %T, ptr %T.Comparable)",
      "shows": "largest(_:_:) takes the address for its result, the addresses of a and b, and two hidden arguments: the address of T's type metadata, and the address of T's witness table for Comparable."
     },
     {
      "in": "largest<A>(_:_:)",
      "has": "%InitializeWithCopy",
      "shows": "Lines 3 and 5 copy a value of type T with the copy function that T's type metadata leads to."
     },
     {
      "in": "main",
      "has": "alloca %TSi",
      "shows": "The top-level code keeps the Int arguments of line 7 in its own stack frame."
     },
     {
      "in": "main",
      "has": "call swiftcc void @\"$s7Example7largestyxx_xtSLRzlF\"(ptr noalias sret(%swift.opaque) @\"$s7Example4cupsSivp\"",
      "shows": "Line 7 calls largest(_:_:) with the address of cups, where its result goes."
     },
     {
      "in": "main",
      "has": "ptr @\"$sSiN\", ptr @\"$sSiSLsWP\")",
      "shows": "Line 7 passes the address of Int's type metadata, and of Int's witness table for Comparable."
     },
     {
      "in": "main",
      "has": "alloca %TSS",
      "shows": "The top-level code keeps the String arguments of line 8 in its own stack frame."
     },
     {
      "in": "main",
      "has": "call swiftcc void @\"$s7Example7largestyxx_xtSLRzlF\"(ptr noalias sret(%swift.opaque) @\"$s7Example4nameSSvp\"",
      "shows": "Line 8 calls the same largest(_:_:), with the address of name, where its result goes."
     },
     {
      "in": "main",
      "has": "ptr @\"$sSSN\", ptr @\"$sSSSLsWP\")",
      "shows": "Line 8 passes the address of String's type metadata, and of String's witness table for Comparable."
     }
    ]
   },
   "snippets": {
    "library": {
     "code": [
      "print(max(3, 8))  // 8",
      "let scores: Array<Int> = [3, 8]",
      "print(scores)  // [3, 8]"
     ],
     "output": [
      "8",
      "[3, 8]"
     ]
    },
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
     "is": "Generic code is a function or a type that is written once, for many types. In place of a type, it uses a type parameter, such as `T`: a parameter that gets a type, not a value, from each use of the code. A type constraint, such as `Comparable`, says what that type must be able to do.",
     "marks": [
      {
       "line": 1,
       "text": "T",
       "part": "type-parameter",
       "label": "type parameter"
      },
      {
       "line": 1,
       "text": ": Comparable",
       "part": "type-constraint",
       "label": "type constraint"
      }
     ],
     "afterExample": "`largest(_:_:)` is a generic function. Line 7 calls it with two `Int` values, and line 8 with two `String` values, so `T` is `Int` in one call, and `String` in the other.",
     "problem": "The same work is often needed for values of different types. Without generic code, finding the larger of two values takes one function for `Int` values, another for `String` values, and so on, each with the same body. Generic code is written once, and swiftc still checks every use of it, as it checks any other code.",
     "how": "When swiftc builds the program, it works out which type each call of `largest(_:_:)` gives `T`, and checks that the type conforms to `Comparable`. The same body runs for every call, and line 2 compares the values the way their type compares them: as numbers for `Int`, and as text for `String`.",
     "when": [
      {
       "text": "Use it when the same code works for many types, and needs only what a protocol requires, as `largest(_:_:)` needs only `Comparable`. Swift's standard library is full of generic code: its `max(_:_:)` does what `largest(_:_:)` does, and `Array` is a generic type, so `Array<Int>` is an array of `Int` values:",
       "snippet": "library"
      },
      {
       "text": "Don't use it for code that only ever works with one type. Then write that type itself, as `double(_:)` does with `Int`:",
       "snippet": "double"
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "generic-parameter-clause",
       "name": "The generic parameter clause, `<T: Comparable>`",
       "text": "A normal function only has `(_ a: T, _ b: T)` for its inputs. Putting `<T: Comparable>` before the inputs makes `largest` a generic function that works with many types.",
       "parts": [
        {
         "part": "type-parameter",
         "name": "The type parameter, `T`",
         "text": "Inside the angle brackets, `T` creates a placeholder for a type. On line 7 `T` becomes `Int`, and on line 8 `T` becomes `String`."
        },
        {
         "part": "type-parameter",
         "id": "type-parameter-inputs",
         "name": "Using `T` for the inputs, `_ a: T, _ b: T`",
         "text": "Both inputs, `a` and `b`, use `T` as their type. That means the two values in a call must be the same type as each other."
        },
        {
         "part": "type-parameter",
         "id": "type-parameter-return",
         "name": "Using `T` for the return type, `-> T`",
         "text": "The return arrow `-> T` also uses `T`. Pass in two `Int` values and `largest` returns an `Int`; pass in two `String` values and it returns a `String`."
        },
        {
         "part": "type-constraint",
         "name": "The type constraint, `: Comparable`",
         "text": "Putting `: Comparable` after `T` adds a rule: `T` must conform to `Comparable`. `Comparable` is Swift's protocol for values that can be compared with `>`."
        },
        {
         "part": "type-constraint",
         "id": "type-constraint-why",
         "name": "Why line 2 needs the rule, `a > b`",
         "text": "Line 2 checks `a > b`. Because `: Comparable` guarantees that `T` supports `>`, Swift knows line 2 is safe to build."
        }
       ]
      },
      {
       "part": "type-argument",
       "name": "The type arguments, on lines 7 and 8",
       "text": "The type that `T` gets in one call is that call's type argument, as 3 is the value that `a` gets on line 7. You do not write a type argument, and for a function Swift does not let you. swiftc works it out when it builds the program, from the types around the call. On line 7, `cups` is an `Int`, so `T` is `Int`, and 3 and 8 are `Int` values. On line 8, `name` is a `String`, so `T` is `String`. Each type argument must conform to `Comparable`, as `Int` and `String` do. A call with an `Int` and a `String` does not build, because `T` cannot be both."
      }
     ],
     "marks": [
      {
       "line": 1,
       "text": "<T: Comparable>",
       "part": "generic-parameter-clause"
      },
      {
       "line": 1,
       "text": "T",
       "part": "type-parameter",
       "label": "type parameter"
      },
      {
       "line": 1,
       "text": ": Comparable",
       "part": "type-constraint",
       "label": "type constraint"
      },
      {
       "line": 1,
       "text": "_ a: T, _ b: T",
       "part": "type-parameter-inputs"
      },
      {
       "line": 1,
       "text": "-> T",
       "part": "type-parameter-return"
      },
      {
       "line": 2,
       "text": "a > b",
       "part": "type-constraint-why"
      },
      {
       "line": 7,
       "text": "largest(3, 8)",
       "part": "type-argument",
       "label": "T is Int"
      },
      {
       "line": 8,
       "text": "largest(\"Bo\", \"Ana\")",
       "part": "type-argument",
       "label": "T is String"
      }
     ],
     "steps": [
      {
       "text": "Line 7 calls `largest(3, 8)`. Its type argument is `Int`, so in this call, `T` is `Int`.",
       "line": 7
      },
      {
       "text": "The body runs, with `a` set to 3 and `b` set to 8. Line 2 checks `a > b`: 3 is not greater than 8, so line 3 does not run.",
       "line": 2,
       "also": [
        1
       ],
       "dim": [
        3
       ],
       "value": {
        "line": 1,
        "name": "a",
        "is": "3"
       }
      },
      {
       "text": "Line 5 returns `b`, so the call gives back 8, and line 7 stores it in `cups`.",
       "line": 5,
       "also": [
        7
       ],
       "value": {
        "line": 7,
        "name": "cups",
        "is": "8"
       }
      },
      {
       "text": "Line 8 calls `largest(\"Bo\", \"Ana\")`. Its type argument is `String`, so in this call, `T` is `String`, and the same body runs, with `a` set to \"Bo\" and `b` set to \"Ana\".",
       "line": 8,
       "also": [
        1
       ],
       "value": {
        "line": 1,
        "name": "a",
        "is": "\"Bo\""
       }
      },
      {
       "text": "Line 2 checks `a > b`. Two strings are compared from their first character, and \"B\" comes after \"A\", so \"Bo\" is greater than \"Ana\". Line 3 returns `a`, and line 8 stores \"Bo\" in `name`.",
       "line": 3,
       "also": [
        2,
        8
       ],
       "value": {
        "line": 8,
        "name": "name",
        "is": "\"Bo\""
       }
      },
      {
       "text": "Line 9 prints {{8}}.",
       "line": 9,
       "prints": [
        "8"
       ]
      },
      {
       "text": "Line 10 prints {{Bo}}.",
       "line": 10,
       "prints": [
        "Bo"
       ]
      }
     ],
     "end": {
      "kind": "question",
      "text": "Line 2 compared two numbers in the first call, and two strings in the second, with the same `a > b`. How does the code of `largest(_:_:)` know which comparison to run?"
     }
    },
    "memory": {
     "question": "Line 2 compared two numbers in the first call, and two strings in the second. In a debug build, swiftc makes one `largest(_:_:)` for both calls. How does that one piece of code know which comparison to run, and how to copy a value of type `T`?",
     "steps": [
      {
       "text": "Line 7 calls `largest(3, 8)`, and a stack frame is made for the call. In a debug build, swiftc makes one `largest(_:_:)` for every type, so its code does not know how big a `T` is. So it gets each value of type `T` by its address. The top-level code keeps 3 and 8 in its own stack frame, and passes their addresses as `a` and `b`. The result goes straight into `cups`, so the call also passes the address of `cups`.",
       "line": 7,
       "blocks": [
        {
         "id": "cups",
         "kind": "global",
         "title": "cups",
         "tag": "constant",
         "fields": [
          [
           "cups",
           null
          ]
         ]
        },
        {
         "id": "top",
         "kind": "frame",
         "title": "top-level code",
         "fields": [
          [
           "for a",
           "3"
          ],
          [
           "for b",
           "8"
          ]
         ]
        },
        {
         "id": "lg",
         "kind": "frame",
         "title": "largest(_:_:)",
         "fields": [
          [
           "a",
           {
            "to": "top",
            "field": "for a"
           }
          ],
          [
           "b",
           {
            "to": "top",
            "field": "for b"
           }
          ],
          [
           "result",
           {
            "to": "cups"
           }
          ]
         ]
        }
       ],
       "highlight": [
        "lg"
       ]
      },
      {
       "text": "The call also passes two hidden arguments, which the code does not show. `T` is the address of `Int`'s type metadata: data that Swift keeps about each type. It gives the size of an `Int`, 8 bytes, and how to copy one. `T: Comparable` is the address of `Int`'s witness table for `Comparable`: a table that Swift makes for each type that conforms to a protocol. It holds where the type's own function for each requirement is.",
       "line": 7,
       "blocks": [
        {
         "id": "cups",
         "kind": "global",
         "title": "cups",
         "tag": "constant",
         "fields": [
          [
           "cups",
           null
          ]
         ]
        },
        {
         "id": "top",
         "kind": "frame",
         "title": "top-level code",
         "fields": [
          [
           "for a",
           "3"
          ],
          [
           "for b",
           "8"
          ]
         ]
        },
        {
         "id": "lg",
         "kind": "frame",
         "title": "largest(_:_:)",
         "fields": [
          [
           "a",
           {
            "to": "top",
            "field": "for a"
           }
          ],
          [
           "b",
           {
            "to": "top",
            "field": "for b"
           }
          ],
          [
           "result",
           {
            "to": "cups"
           }
          ],
          [
           "T",
           {
            "to": "intT"
           }
          ],
          [
           "T: Comparable",
           {
            "to": "intC"
           }
          ]
         ]
        },
        {
         "id": "intT",
         "kind": "data",
         "title": "Int",
         "tag": "type metadata",
         "fields": [
          [
           "size",
           "8 bytes"
          ],
          [
           "copy",
           "copies an Int"
          ]
         ]
        },
        {
         "id": "intC",
         "kind": "data",
         "title": "Int: Comparable",
         "tag": "witness table",
         "fields": [
          [
           "<",
           "Int's <"
          ],
          [
           "<=",
           "Int's <="
          ],
          [
           ">=",
           "Int's >="
          ],
          [
           ">",
           "Int's >"
          ]
         ]
        }
       ],
       "highlight": [
        "intT",
        "intC"
       ]
      },
      {
       "text": "Line 2 runs `a > b`. The code of `largest(_:_:)` does not know that `T` is `Int`, so it looks up > in the witness table, and calls the > that `Int` uses, with the addresses `a` and `b`. 3 is not greater than 8, so the answer is false.",
       "line": 2,
       "blocks": [
        {
         "id": "cups",
         "kind": "global",
         "title": "cups",
         "tag": "constant",
         "fields": [
          [
           "cups",
           null
          ]
         ]
        },
        {
         "id": "top",
         "kind": "frame",
         "title": "top-level code",
         "fields": [
          [
           "for a",
           "3"
          ],
          [
           "for b",
           "8"
          ]
         ]
        },
        {
         "id": "lg",
         "kind": "frame",
         "title": "largest(_:_:)",
         "fields": [
          [
           "a",
           {
            "to": "top",
            "field": "for a"
           }
          ],
          [
           "b",
           {
            "to": "top",
            "field": "for b"
           }
          ],
          [
           "result",
           {
            "to": "cups"
           }
          ],
          [
           "T",
           {
            "to": "intT"
           }
          ],
          [
           "T: Comparable",
           {
            "to": "intC"
           }
          ]
         ]
        },
        {
         "id": "intT",
         "kind": "data",
         "title": "Int",
         "tag": "type metadata",
         "fields": [
          [
           "size",
           "8 bytes"
          ],
          [
           "copy",
           "copies an Int"
          ]
         ]
        },
        {
         "id": "intC",
         "kind": "data",
         "title": "Int: Comparable",
         "tag": "witness table",
         "fields": [
          [
           "<",
           "Int's <"
          ],
          [
           "<=",
           "Int's <="
          ],
          [
           ">=",
           "Int's >="
          ],
          [
           ">",
           "Int's >"
          ]
         ]
        }
       ],
       "highlight": [
        "intC"
       ]
      },
      {
       "text": "Line 5 returns `b`. `largest(_:_:)` copies the 8 at `b` into `cups`, with the size and the copy function that `Int`'s type metadata gives. The call ends, and its frame is removed.",
       "line": 5,
       "blocks": [
        {
         "id": "cups",
         "kind": "global",
         "title": "cups",
         "tag": "constant",
         "fields": [
          [
           "cups",
           "8"
          ]
         ]
        },
        {
         "id": "top",
         "kind": "frame",
         "title": "top-level code",
         "fields": [
          [
           "for a",
           "3"
          ],
          [
           "for b",
           "8"
          ]
         ]
        },
        {
         "id": "lg",
         "kind": "removed",
         "title": "largest(_:_:)",
         "text": "its frame is gone"
        },
        {
         "id": "intT",
         "kind": "data",
         "title": "Int",
         "tag": "type metadata",
         "fields": [
          [
           "size",
           "8 bytes"
          ],
          [
           "copy",
           "copies an Int"
          ]
         ]
        },
        {
         "id": "intC",
         "kind": "data",
         "title": "Int: Comparable",
         "tag": "witness table",
         "fields": [
          [
           "<",
           "Int's <"
          ],
          [
           "<=",
           "Int's <="
          ],
          [
           ">=",
           "Int's >="
          ],
          [
           ">",
           "Int's >"
          ]
         ]
        }
       ],
       "highlight": [
        "cups",
        "intT"
       ]
      },
      {
       "text": "Line 8 calls `largest(\"Bo\", \"Ana\")`, and the same code runs again, in a new stack frame. This time `a` and `b` are the addresses of two `String` values, and the result goes into `name`. `T` is the address of `String`'s type metadata, which gives the size of a `String`, 16 bytes, and `T: Comparable` is the address of `String`'s witness table for `Comparable`.",
       "line": 8,
       "blocks": [
        {
         "id": "cups",
         "kind": "global",
         "title": "cups",
         "tag": "constant",
         "fields": [
          [
           "cups",
           "8"
          ]
         ]
        },
        {
         "id": "name",
         "kind": "global",
         "title": "name",
         "tag": "constant",
         "fields": [
          [
           "name",
           null
          ]
         ]
        },
        {
         "id": "top",
         "kind": "frame",
         "title": "top-level code",
         "fields": [
          [
           "for a",
           "\"Bo\""
          ],
          [
           "for b",
           "\"Ana\""
          ]
         ]
        },
        {
         "id": "lg2",
         "kind": "frame",
         "title": "largest(_:_:)",
         "fields": [
          [
           "a",
           {
            "to": "top",
            "field": "for a"
           }
          ],
          [
           "b",
           {
            "to": "top",
            "field": "for b"
           }
          ],
          [
           "result",
           {
            "to": "name"
           }
          ],
          [
           "T",
           {
            "to": "strT"
           }
          ],
          [
           "T: Comparable",
           {
            "to": "strC"
           }
          ]
         ]
        },
        {
         "id": "intT",
         "kind": "data",
         "title": "Int",
         "tag": "type metadata",
         "fields": [
          [
           "size",
           "8 bytes"
          ],
          [
           "copy",
           "copies an Int"
          ]
         ]
        },
        {
         "id": "intC",
         "kind": "data",
         "title": "Int: Comparable",
         "tag": "witness table",
         "fields": [
          [
           "<",
           "Int's <"
          ],
          [
           "<=",
           "Int's <="
          ],
          [
           ">=",
           "Int's >="
          ],
          [
           ">",
           "Int's >"
          ]
         ]
        },
        {
         "id": "strT",
         "kind": "data",
         "title": "String",
         "tag": "type metadata",
         "fields": [
          [
           "size",
           "16 bytes"
          ],
          [
           "copy",
           "copies a String"
          ]
         ]
        },
        {
         "id": "strC",
         "kind": "data",
         "title": "String: Comparable",
         "tag": "witness table",
         "fields": [
          [
           "<",
           "String's <"
          ],
          [
           "<=",
           "String's <="
          ],
          [
           ">=",
           "String's >="
          ],
          [
           ">",
           "String's >"
          ]
         ]
        }
       ],
       "highlight": [
        "lg2",
        "strT",
        "strC"
       ]
      },
      {
       "text": "Line 2 looks up > in `String`'s witness table, so `a > b` compares text: \"Bo\" comes after \"Ana\", so line 3 returns `a`. `largest(_:_:)` copies \"Bo\" into `name`, with the copy function that `String`'s type metadata gives. The call ends, and its frame is removed.",
       "line": 3,
       "also": [
        2
       ],
       "blocks": [
        {
         "id": "cups",
         "kind": "global",
         "title": "cups",
         "tag": "constant",
         "fields": [
          [
           "cups",
           "8"
          ]
         ]
        },
        {
         "id": "name",
         "kind": "global",
         "title": "name",
         "tag": "constant",
         "fields": [
          [
           "name",
           "\"Bo\""
          ]
         ]
        },
        {
         "id": "top",
         "kind": "frame",
         "title": "top-level code",
         "fields": [
          [
           "for a",
           "\"Bo\""
          ],
          [
           "for b",
           "\"Ana\""
          ]
         ]
        },
        {
         "id": "lg2",
         "kind": "removed",
         "title": "largest(_:_:)",
         "text": "its frame is gone"
        },
        {
         "id": "intT",
         "kind": "data",
         "title": "Int",
         "tag": "type metadata",
         "fields": [
          [
           "size",
           "8 bytes"
          ],
          [
           "copy",
           "copies an Int"
          ]
         ]
        },
        {
         "id": "intC",
         "kind": "data",
         "title": "Int: Comparable",
         "tag": "witness table",
         "fields": [
          [
           "<",
           "Int's <"
          ],
          [
           "<=",
           "Int's <="
          ],
          [
           ">=",
           "Int's >="
          ],
          [
           ">",
           "Int's >"
          ]
         ]
        },
        {
         "id": "strT",
         "kind": "data",
         "title": "String",
         "tag": "type metadata",
         "fields": [
          [
           "size",
           "16 bytes"
          ],
          [
           "copy",
           "copies a String"
          ]
         ]
        },
        {
         "id": "strC",
         "kind": "data",
         "title": "String: Comparable",
         "tag": "witness table",
         "fields": [
          [
           "<",
           "String's <"
          ],
          [
           "<=",
           "String's <="
          ],
          [
           ">=",
           "String's >="
          ],
          [
           ">",
           "String's >"
          ]
         ]
        }
       ],
       "highlight": [
        "strC",
        "name"
       ]
      },
      {
       "text": "Line 9 prints {{8}}, and line 10 prints {{Bo}}.",
       "line": 9,
       "also": [
        10
       ],
       "prints": [
        "8",
        "Bo"
       ],
       "blocks": [
        {
         "id": "cups",
         "kind": "global",
         "title": "cups",
         "tag": "constant",
         "fields": [
          [
           "cups",
           "8"
          ]
         ]
        },
        {
         "id": "name",
         "kind": "global",
         "title": "name",
         "tag": "constant",
         "fields": [
          [
           "name",
           "\"Bo\""
          ]
         ]
        },
        {
         "id": "intT",
         "kind": "data",
         "title": "Int",
         "tag": "type metadata",
         "fields": [
          [
           "size",
           "8 bytes"
          ],
          [
           "copy",
           "copies an Int"
          ]
         ]
        },
        {
         "id": "intC",
         "kind": "data",
         "title": "Int: Comparable",
         "tag": "witness table",
         "fields": [
          [
           "<",
           "Int's <"
          ],
          [
           "<=",
           "Int's <="
          ],
          [
           ">=",
           "Int's >="
          ],
          [
           ">",
           "Int's >"
          ]
         ]
        },
        {
         "id": "strT",
         "kind": "data",
         "title": "String",
         "tag": "type metadata",
         "fields": [
          [
           "size",
           "16 bytes"
          ],
          [
           "copy",
           "copies a String"
          ]
         ]
        },
        {
         "id": "strC",
         "kind": "data",
         "title": "String: Comparable",
         "tag": "witness table",
         "fields": [
          [
           "<",
           "String's <"
          ],
          [
           "<=",
           "String's <="
          ],
          [
           ">=",
           "String's >="
          ],
          [
           ">",
           "String's >"
          ]
         ]
        }
       ],
       "highlight": [
        "cups",
        "name"
       ]
      }
     ],
     "answer": "Each call passes `largest(_:_:)` two hidden arguments: the address of `T`'s type metadata, which gives the size of a `T` and how to copy one, and the address of `T`'s witness table for `Comparable`, where line 2 finds the comparison. So one piece of code works for `Int` and for `String`. A build with optimization can do less work: swiftc can put the body of `largest(_:_:)` right into each call, or make a copy of it for `Int` alone, which needs no hidden arguments."
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
     "afterExample": "`Score()` on line 5 makes an instance of the class `Score`, and the instance is a heap object. `score` does not hold the object itself: it holds the object's address, which Swift calls a reference to the object.",
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
  "implementation": {
   "id": "implementation",
   "name": "Implementation",
   "first": "A method or property of a conforming type that meets one of a protocol's requirements.",
   "parts": []
  },
  "in-keyword": {
   "id": "in-keyword",
   "name": "in",
   "first": "The keyword that comes after a closure's parameter list, and after its return type when it has one. The body starts after it.",
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
   "first": "One input of a function or closure. It has a name, and the type of the value it holds.",
   "parts": []
  },
  "projected-value-property": {
   "id": "projected-value-property",
   "name": "Projected value property",
   "first": "A property that a property wrapper can have beside its wrapped value, which gives a second value, of any type, for each property that the wrapper is used on.",
   "parts": []
  },
  "projected-value": {
   "id": "projected-value",
   "name": "Projected value",
   "area": "ui",
   "first": "A second value that a property wrapper can give for each property it is used on, read by writing a dollar sign before the property's name.",
   "parts": [
    "projected-value-property",
    "dollar-sign"
   ],
   "dependsOn": [
    {
     "id": "property-wrapper",
     "views": [
      "what",
      "parts"
     ],
     "why": "A projected value belongs to a property wrapper, and is read through a property that uses the wrapper.",
     "whyInExample": "`game.$score` reads the projected value of `AtMostTen`, the property wrapper that `Game` uses on `score`."
    }
   ],
   "example": {
    "code": [
     "@propertyWrapper",
     "struct AtMostTen {",
     "    var number = 0",
     "    var projectedValue = false",
     "    var wrappedValue: Int {",
     "        get { return number }",
     "        set {",
     "            number = min(newValue, 10)",
     "            projectedValue = newValue > 10",
     "        }",
     "    }",
     "}",
     "struct Game {",
     "    @AtMostTen var score: Int",
     "}",
     "var game = Game()",
     "game.score = 4",
     "print(game.$score)",
     "game.score = 25",
     "print(game.score, game.$score)"
    ],
    "sil": [
     {
      "in": "Game.$score.getter",
      "has": "struct_extract %2, #AtMostTen.projectedValue",
      "shows": "Reading $score reads the projectedValue of the AtMostTen that each Game keeps for score."
     }
    ]
   },
   "snippets": {
    "binding": {
     "code": [
      "import SwiftUI",
      "struct NameField: View {",
      "    @State var name = \"Ana\"",
      "    var body: some View {",
      "        TextField(\"Name\", text: $name)",
      "    }",
      "}",
      "print(type(of: NameField().$name))  // Binding<String>"
     ],
     "output": [
      "Binding<String>"
     ]
    }
   },
   "views": {
    "what": {
     "is": "A projected value is a second value that a property wrapper can give for each property it is used on, beside the property's own value. Code reads it by writing a dollar sign before the property's name.",
     "marks": [
      {
       "line": 4,
       "text": "projectedValue",
       "part": "projected-value-property",
       "label": "projected value"
      },
      {
       "line": 18,
       "text": "$",
       "part": "dollar-sign",
       "label": "dollar sign"
      }
     ],
     "afterExample": "The property wrapper `AtMostTen` gives `score` a projected value, which is true when the last value written to `score` was more than 10. Line 18 reads it as `game.$score`.",
     "problem": "A property wrapper sometimes has more to tell about a property than its value, such as whether it changed the value it was given. A property gives only one value, of its own type. A projected value gives a second value, of any type, through the same property's name.",
     "how": "swiftc gives `Game` a second property, `$score`, beside `score`. Reading `game.$score` reads the `projectedValue` of the instance of `AtMostTen` that `game` keeps for `score`.",
     "when": [
      {
       "text": "Use one in SwiftUI to give another view a value that a view keeps, so that the other view can change it. The projected value of `@State` is a `Binding`, which reads and writes the state's value:",
       "snippet": "binding"
      },
      {
       "text": "Use one in your own property wrapper when it has a second value to give, such as `AtMostTen`'s `projectedValue`, which tells whether the last value was more than 10."
      },
      {
       "text": "Don't add one when the wrapped value says everything. A property wrapper needs only `wrappedValue`. Writing `$` before the name of a property whose wrapper has no projected value does not build."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "projected-value-property",
       "name": "The property `projectedValue`, line 4",
       "text": "Line 4 declares `projectedValue`, a property of the property wrapper `AtMostTen`. A property wrapper that has a property with this name has a projected value, of any type. Here it is a Boolean, and it starts as `false`. Line 9, in the setter of `wrappedValue`, sets it to true when `newValue` is more than 10, and to false when it is not."
      },
      {
       "part": "dollar-sign",
       "name": "The dollar sign, in `$score`",
       "text": "A dollar sign before the name of a wrapped property reads the wrapper's projected value, in place of its wrapped value. So on line 18, `game.$score` reads the `projectedValue` of the instance of `AtMostTen` that keeps `score`. On line 20, `game.score` reads its `wrappedValue`."
      }
     ],
     "marks": [
      {
       "line": 4,
       "text": "projectedValue",
       "part": "projected-value-property",
       "label": "projected value"
      },
      {
       "line": 9,
       "text": "projectedValue",
       "part": "projected-value-property"
      },
      {
       "line": 18,
       "text": "$",
       "part": "dollar-sign",
       "label": "dollar sign"
      },
      {
       "line": 20,
       "text": "$",
       "part": "dollar-sign",
       "label": "dollar sign"
      }
     ],
     "steps": [
      {
       "text": "Line 16 makes a `Game`, and stores it in `game`. Its instance of `AtMostTen` for `score` starts with `number` set to 0 and `projectedValue` set to `false`.",
       "line": 16,
       "also": [
        3,
        4
       ]
      },
      {
       "text": "Line 17 writes 4 to `game.score`. That runs the setter of `wrappedValue`, with `newValue` set to 4.",
       "line": 17,
       "also": [
        7
       ]
      },
      {
       "text": "Line 8 stores 4 in `number`. 4 is not more than 10, so line 9 sets `projectedValue` to false.",
       "line": 9,
       "also": [
        8
       ],
       "value": {
        "line": 9,
        "name": "projectedValue",
        "is": "false"
       }
      },
      {
       "text": "Line 18 reads `game.$score`, the `projectedValue` of the instance of `AtMostTen` for `score`. Line 18 prints {{false}}.",
       "line": 18,
       "prints": [
        "false"
       ]
      },
      {
       "text": "Line 19 writes 25 to `game.score`, and the setter runs again, with `newValue` set to 25.",
       "line": 19,
       "also": [
        7
       ]
      },
      {
       "text": "Line 8 stores 10 in `number`, because 10 is smaller than 25. 25 is more than 10, so line 9 sets `projectedValue` to true.",
       "line": 9,
       "also": [
        8
       ],
       "value": {
        "line": 9,
        "name": "projectedValue",
        "is": "true"
       }
      },
      {
       "text": "Line 20 reads `game.score`, which is 10, and `game.$score`, which is true. Line 20 prints {{10 true}}.",
       "line": 20,
       "prints": [
        "10 true"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "A projected value is a second value of a property wrapper. `game.score` reads the wrapper's `wrappedValue`, and `game.$score` reads its `projectedValue`."
     }
    }
   }
  },
  "property-wrapper-attribute": {
   "id": "property-wrapper-attribute",
   "name": "Property wrapper attribute",
   "first": "The attribute, written with an at sign before the declaration of a type, that makes the type a property wrapper.",
   "parts": []
  },
  "property-wrapper": {
   "id": "property-wrapper",
   "name": "Property wrapper",
   "area": "swift",
   "first": "A type that keeps the value of a property, and runs its own code each time the property is read or written.",
   "parts": [
    "property-wrapper-attribute",
    "wrapped-value",
    "wrapped-property"
   ],
   "dependsOn": [
    {
     "id": "function",
     "views": [
      "what",
      "parts"
     ],
     "why": "The getter and the setter of a property wrapper's wrapped value are blocks of code that run each time the property is read or written, and the getter returns a value, as a function's body does."
    }
   ],
   "example": {
    "code": [
     "@propertyWrapper",
     "struct AtMostTen {",
     "    var number = 0",
     "    var wrappedValue: Int {",
     "        get { return number }",
     "        set {",
     "            number = min(newValue, 10)",
     "        }",
     "    }",
     "}",
     "struct Game {",
     "    @AtMostTen var score: Int",
     "}",
     "var game = Game()",
     "game.score = 4",
     "print(game.score)",
     "game.score = 25",
     "print(game.score)"
    ],
    "sil": [
     {
      "in": "Game.score.getter",
      "has": "struct_extract %0, #Game._score",
      "shows": "Each Game keeps an AtMostTen for score, in a stored property that swiftc adds and the code does not write."
     },
     {
      "in": "Game.score.getter",
      "has": "function_ref AtMostTen.wrappedValue.getter",
      "shows": "Reading score runs the getter of AtMostTen's wrappedValue."
     }
    ]
   },
   "snippets": {
    "two": {
     "code": [
      "@propertyWrapper",
      "struct AtMostTen {",
      "    var number = 0",
      "    var wrappedValue: Int {",
      "        get { return number }",
      "        set { number = min(newValue, 10) }",
      "    }",
      "}",
      "struct Game {",
      "    @AtMostTen var score: Int",
      "    @AtMostTen var lives: Int",
      "}",
      "var game = Game()",
      "game.score = 25",
      "game.lives = 12",
      "print(game.score, game.lives)  // 10 10"
     ],
     "output": [
      "10 10"
     ]
    },
    "state": {
     "code": [
      "import SwiftUI",
      "struct NameLabel: View {",
      "    @State var name = \"Ana\"",
      "    var body: some View {",
      "        Text(name)",
      "    }",
      "}",
      "print(NameLabel().name)  // Ana"
     ],
     "output": [
      "Ana"
     ]
    }
   },
   "views": {
    "what": {
     "is": "A property wrapper is a type that keeps the value of a property, and runs its own code each time the property is read or written. The code is written once, in the wrapper. Any property can then use it, by writing the wrapper's name before the property, after an at sign.",
     "marks": [
      {
       "line": 1,
       "text": "@propertyWrapper",
       "part": "property-wrapper-attribute",
       "label": "makes it a property wrapper"
      },
      {
       "line": 12,
       "text": "@AtMostTen var score: Int",
       "part": "wrapped-property",
       "label": "uses AtMostTen"
      }
     ],
     "afterExample": "The structure `AtMostTen` is a property wrapper. Line 12 uses it on the property `score`, so `score` is never more than 10: line 17 writes 25, and line 18 prints {{10}}.",
     "problem": "Some properties need the same code each time they are read or written, such as code that keeps a number at 10 or less. Without a property wrapper, each of those properties writes its own getter and setter with that code in them. A property wrapper keeps the code in one type, and a property uses it with one attribute.",
     "how": "For a property that uses a wrapper, swiftc adds a stored property that holds an instance of the wrapper. Reading `game.score` runs the getter of the wrapper's `wrappedValue`, and writing it runs the setter.",
     "when": [
      {
       "text": "Use one when several properties need the same code each time they are read or written. Each property writes the wrapper's name before it:",
       "snippet": "two"
      },
      {
       "text": "SwiftUI's `@State` is a property wrapper. A view writes it before a property, as `Game` writes `@AtMostTen`, and SwiftUI then keeps the value for the view:",
       "snippet": "state"
      },
      {
       "text": "Don't write one for a single property whose code no other property needs. Then that property's own getter and setter are enough."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "property-wrapper-attribute",
       "name": "The attribute `@propertyWrapper`",
       "text": "An attribute starts with an at sign, and is written before a declaration to give swiftc more information about it. On line 1, the attribute `@propertyWrapper` makes the structure `AtMostTen` a property wrapper. swiftc then checks that `AtMostTen` has a property named `wrappedValue`: without one, line 2 does not build."
      },
      {
       "part": "wrapped-value",
       "name": "The wrapped value, lines 4 to 9",
       "text": "Lines 4 to 9 declare `wrappedValue`, the property that every property wrapper must have. Its getter, on line 5, is code that runs each time the property is read, and it returns `number`. Its setter, on lines 6 to 8, is code that runs each time the property is written, with the value written as `newValue`. Line 7 stores the smaller of `newValue` and 10 in `number`."
      },
      {
       "part": "wrapped-property",
       "name": "The wrapped property, `score`",
       "text": "On line 12, the name of the wrapper is written as an attribute, `@AtMostTen`, before `var score: Int`. That makes `score` a wrapped property. Each `Game` keeps an instance of `AtMostTen` for `score`, and reading or writing `score` reads or writes that instance's `wrappedValue`."
      }
     ],
     "marks": [
      {
       "line": 1,
       "text": "@propertyWrapper",
       "part": "property-wrapper-attribute",
       "label": "attribute"
      },
      {
       "line": 4,
       "text": "wrappedValue",
       "part": "wrapped-value",
       "label": "wrapped value"
      },
      {
       "line": 5,
       "text": "get",
       "part": "wrapped-value",
       "label": "getter"
      },
      {
       "line": 6,
       "text": "set",
       "part": "wrapped-value",
       "label": "setter"
      },
      {
       "line": 12,
       "text": "@AtMostTen",
       "part": "wrapped-property",
       "label": "wrapper's name"
      },
      {
       "line": 12,
       "text": "score",
       "part": "wrapped-property",
       "label": "wrapped property"
      }
     ],
     "steps": [
      {
       "text": "Line 14 makes a `Game`, and stores it in `game`. Its instance of `AtMostTen` for `score` starts with `number` set to 0.",
       "line": 14,
       "also": [
        3
       ]
      },
      {
       "text": "Line 15 writes 4 to `game.score`. That runs the setter of `wrappedValue`, with `newValue` set to 4.",
       "line": 15,
       "also": [
        6
       ]
      },
      {
       "text": "Line 7 stores the smaller of 4 and 10, which is 4, in `number`.",
       "line": 7,
       "value": {
        "line": 7,
        "name": "number",
        "is": "4"
       }
      },
      {
       "text": "Line 16 reads `game.score`. That runs the getter on line 5, which returns `number`. Line 16 prints {{4}}.",
       "line": 16,
       "also": [
        5
       ],
       "prints": [
        "4"
       ]
      },
      {
       "text": "Line 17 writes 25 to `game.score`, and the setter runs again, with `newValue` set to 25.",
       "line": 17,
       "also": [
        6
       ]
      },
      {
       "text": "Line 7 stores the smaller of 25 and 10, which is 10, in `number`.",
       "line": 7,
       "value": {
        "line": 7,
        "name": "number",
        "is": "10"
       }
      },
      {
       "text": "Line 18 reads `game.score`, and the getter returns 10. Line 18 prints {{10}}.",
       "line": 18,
       "also": [
        5
       ],
       "prints": [
        "10"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "A property wrapper keeps a property's value in an instance of its own type. Writing `game.score` runs the wrapper's setter, which keeps the value at 10 or less, and reading it runs the wrapper's getter."
     }
    }
   }
  },
  "protocol-keyword": {
   "id": "protocol-keyword",
   "name": "protocol",
   "first": "The keyword that declares a protocol. The protocol's name comes right after it.",
   "parts": []
  },
  "protocol": {
   "id": "protocol",
   "name": "Protocol",
   "area": "swift",
   "first": "A named list of requirements, such as methods and properties, that a type conforms to by naming the protocol and having everything it requires.",
   "parts": [
    "protocol-keyword",
    "requirement",
    "conformance",
    "implementation"
   ],
   "dependsOn": [
    {
     "id": "function",
     "views": [
      "what",
      "parts"
     ],
     "why": "A protocol's method requirement is written as the first line of a function, with no body.",
     "whyInExample": "Line 2 of `Greeter` is the first line of a function, `greet(name:)`, as line 1 of `greet` is, but with no body."
    }
   ],
   "example": {
    "code": [
     "protocol Greeter {",
     "    func greet(name: String) -> String",
     "}",
     "struct Friendly: Greeter {",
     "    func greet(name: String) -> String {",
     "        return \"Hello, \\(name)\"",
     "    }",
     "}",
     "let host = Friendly()",
     "print(host.greet(name: \"Ana\"))"
    ]
   },
   "snippets": {
    "two": {
     "code": [
      "protocol Greeter {",
      "    func greet(name: String) -> String",
      "}",
      "struct Friendly: Greeter {",
      "    func greet(name: String) -> String { \"Hello, \\(name)\" }",
      "}",
      "struct Formal: Greeter {",
      "    func greet(name: String) -> String { \"Good day, \\(name)\" }",
      "}",
      "print(Friendly().greet(name: \"Ana\"))  // Hello, Ana",
      "print(Formal().greet(name: \"Ana\"))    // Good day, Ana"
     ],
     "output": [
      "Hello, Ana",
      "Good day, Ana"
     ]
    }
   },
   "views": {
    "what": {
     "is": "A protocol is a named list of requirements: methods and properties that a type must have. A type conforms to a protocol when it writes the protocol's name after its own, with a colon, and has everything the protocol requires.",
     "marks": [
      {
       "line": 2,
       "text": "func greet(name: String) -> String",
       "part": "requirement",
       "label": "requirement"
      },
      {
       "line": 4,
       "text": ": Greeter",
       "part": "conformance",
       "label": "conforms to Greeter"
      }
     ],
     "afterExample": "`Greeter` is a protocol with one requirement, the method `greet(name:)`. `Friendly` conforms to `Greeter`: line 4 says so, and lines 5 to 7 give `Friendly` its own `greet(name:)`.",
     "problem": "Code often needs to know only what a value can do, not which type it is. A protocol states what a type must be able to do, as a list of requirements, and swiftc checks that every type that conforms to it has them all.",
     "how": "A requirement has no body: it gives only a name, a parameter list, and a return type. Each type that conforms writes its own method, with a body. If `Friendly` had no `greet(name:)`, line 4 would not build: swiftc says that type `Friendly` does not conform to protocol `Greeter`.",
     "when": [
      {
       "text": "Use one when several types must offer the same methods or properties, so that code can rely on them. Each type writes its own:",
       "snippet": "two"
      },
      {
       "text": "Don't write one for a single type that no other type has to match. Then the type's own methods are enough, as `Friendly`'s would be without `: Greeter`."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "protocol-keyword",
       "name": "`protocol`",
       "text": "`protocol` is a keyword. On line 1 it declares a protocol, and the protocol's name, `Greeter`, comes right after it. The protocol's requirements are between the braces on lines 1 and 3."
      },
      {
       "part": "requirement",
       "name": "The requirement, on line 2",
       "text": "Line 2 is a requirement: a method that every type that conforms to `Greeter` must have. A method is a function that belongs to a type. A method requirement is written as the first line of a function, with no body, so it gives only the method's name, its parameter list, and its return type."
      },
      {
       "part": "conformance",
       "name": "The conformance, `: Greeter`",
       "text": "On line 4, `: Greeter` after the name `Friendly` says that `Friendly` conforms to `Greeter`. swiftc then checks that `Friendly` has everything that `Greeter` requires. A type that has the method, but does not write `: Greeter`, does not conform to `Greeter`."
      },
      {
       "part": "implementation",
       "name": "The implementation, lines 5 to 7",
       "text": "Lines 5 to 7 are `Friendly`'s own `greet(name:)`. It has the name, the parameter list, and the return type of the requirement on line 2, and a body. It meets that requirement, so it is called the requirement's implementation."
      }
     ],
     "marks": [
      {
       "line": 1,
       "text": "protocol",
       "part": "protocol-keyword"
      },
      {
       "line": 2,
       "text": "func greet(name: String) -> String",
       "part": "requirement",
       "label": "requirement"
      },
      {
       "line": 4,
       "text": ": Greeter",
       "part": "conformance",
       "label": "conformance"
      },
      {
       "line": 5,
       "text": "func greet(name: String) -> String",
       "part": "implementation",
       "label": "implementation"
      },
      {
       "line": 6,
       "text": "return \"Hello, \\(name)\"",
       "part": "implementation"
      }
     ],
     "steps": [
      {
       "text": "Line 9 makes a `Friendly` value, and stores it in `host`.",
       "line": 9
      },
      {
       "text": "Line 10 calls `greet(name:)` on `host`, with the argument `\"Ana\"`.",
       "line": 10
      },
      {
       "text": "`host` is a `Friendly`, so `Friendly`'s own `greet(name:)` runs, with `name` set to `\"Ana\"`. Line 6 returns the string \"Hello, Ana\".",
       "line": 6,
       "also": [
        5
       ],
       "value": {
        "line": 6,
        "name": "name",
        "is": "\"Ana\""
       }
      },
      {
       "text": "Line 10 prints {{Hello, Ana}}.",
       "line": 10,
       "prints": [
        "Hello, Ana"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "A protocol lists what a type must have, with no bodies. `Friendly` conforms to `Greeter`, and its own `greet(name:)` is the code that runs."
     }
    }
   }
  },
  "requirement": {
   "id": "requirement",
   "name": "Requirement",
   "first": "One method or property that a protocol lists, which every type that conforms to it must have.",
   "parts": []
  },
  "return-statement": {
   "id": "return-statement",
   "name": "return",
   "first": "The keyword that ends a call of a function, and gives back the value written after it.",
   "parts": []
  },
  "return-type": {
   "id": "return-type",
   "name": "Return type",
   "first": "The type of the value that a function gives back, written after the return arrow.",
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
   "first": "A region of memory, one for each thread, that holds a stack frame for each call that the thread is running.",
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
  "type-argument": {
   "id": "type-argument",
   "name": "Type argument",
   "first": "The type that a type parameter gets in one call or use of generic code, as an argument is the value that a parameter gets in one call.",
   "parts": []
  },
  "type-constraint": {
   "id": "type-constraint",
   "name": "Type constraint",
   "first": "A rule written after a type parameter (with a colon) that limits which types it is allowed to be, so the generic code knows what operations that type supports.",
   "parts": []
  },
  "type-parameter": {
   "id": "type-parameter",
   "name": "Type parameter",
   "first": "A placeholder for a type in generic code: each call or use of that code fills it in with a concrete type.",
   "parts": []
  },
  "used-in-body": {
   "id": "used-in-body",
   "name": "Used in the body",
   "first": "A place where a closure's body uses a constant or variable from the function around the closure.",
   "parts": []
  },
  "variable-outside-closure": {
   "id": "variable-outside-closure",
   "name": "Variable outside the closure",
   "first": "A variable declared in the function around a closure, which the closure's body can change.",
   "parts": []
  },
  "variable-used-in-body": {
   "id": "variable-used-in-body",
   "name": "Variable used in the body",
   "first": "A place where a closure's body changes or reads a variable from outside its braces. It is the same variable, not a copy.",
   "parts": []
  },
  "wrapped-property": {
   "id": "wrapped-property",
   "name": "Wrapped property",
   "first": "A property with a property wrapper's name before it, written as an attribute, so that reading and writing the property reads and writes the wrapper's wrapped value.",
   "parts": []
  },
  "wrapped-value": {
   "id": "wrapped-value",
   "name": "Wrapped value",
   "first": "The property that every property wrapper must have, which gives the value of each property that the wrapper is used on.",
   "parts": []
  }
 },
 "known": [
  "function",
  "closure",
  "property-wrapper"
 ],
 "planned": [
  {
   "id": "optional",
   "name": "Optional",
   "area": "swift",
   "needs": [],
   "first": "A value that is either a value of its type, or nil."
  },
  {
   "id": "structure",
   "name": "Structure",
   "area": "swift",
   "needs": [
    "function"
   ],
   "first": "A type that groups values under one name, and is copied when it is assigned or passed."
  },
  {
   "id": "class",
   "name": "Class",
   "area": "swift",
   "needs": [
    "structure",
    "heap-object"
   ],
   "first": "A type whose instances are shared: assigning one copies its address, not the instance."
  },
  {
   "id": "escaping-closure",
   "name": "Escaping closure",
   "area": "swift",
   "needs": [
    "closure-value"
   ],
   "first": "A closure that can be called after the function it was passed to has returned."
  },
  {
   "id": "opaque-type",
   "name": "Opaque type",
   "area": "swift",
   "needs": [
    "protocol",
    "generics"
   ],
   "first": "A return type that names only a protocol, while swiftc still knows the real type."
  },
  {
   "id": "result-builder",
   "name": "Result builder",
   "area": "swift",
   "needs": [
    "closure",
    "generics"
   ],
   "first": "A type whose methods combine the lines of a closure's body into one value."
  },
  {
   "id": "arc",
   "name": "Automatic Reference Counting",
   "area": "memory",
   "needs": [
    "heap-object",
    "class"
   ],
   "first": "Swift counts the references to each class instance, and frees the instance when the count reaches zero."
  },
  {
   "id": "strong-reference-cycle",
   "name": "Strong reference cycle",
   "area": "memory",
   "needs": [
    "arc",
    "capture"
   ],
   "first": "Two instances that refer to each other, so neither count reaches zero and neither is freed."
  },
  {
   "id": "weak-reference",
   "name": "Weak reference",
   "area": "memory",
   "needs": [
    "strong-reference-cycle",
    "optional"
   ],
   "first": "A reference that does not keep its instance, and becomes nil when the instance is freed."
  },
  {
   "id": "copy-on-write",
   "name": "Copy on write",
   "area": "memory",
   "needs": [
    "structure",
    "arc"
   ],
   "first": "A value whose copies share one storage on the heap, until one copy is changed."
  },
  {
   "id": "task",
   "name": "Task",
   "area": "conc",
   "needs": [
    "async-function",
    "closure"
   ],
   "first": "Work that runs an async closure, at the same time as the code that started it."
  },
  {
   "id": "task-group",
   "name": "Task group",
   "area": "conc",
   "needs": [
    "task"
   ],
   "first": "A set of child tasks that run at the same time, whose results the task that made them waits for."
  },
  {
   "id": "actor",
   "name": "Actor",
   "area": "conc",
   "needs": [
    "task",
    "class"
   ],
   "first": "A reference type that runs one piece of its code at a time, so its state is never changed by two tasks at once."
  },
  {
   "id": "main-actor",
   "name": "Main actor",
   "area": "conc",
   "needs": [
    "actor"
   ],
   "first": "The actor that runs code on the main thread, where an app's user interface is changed."
  },
  {
   "id": "sendable",
   "name": "Sendable",
   "area": "conc",
   "needs": [
    "actor",
    "structure"
   ],
   "first": "A type whose values can be passed safely from one task or actor to another."
  },
  {
   "id": "data-race-safety",
   "name": "Data-race safety",
   "area": "conc",
   "needs": [
    "sendable",
    "main-actor"
   ],
   "first": "Swift 6 checks, when it builds a program, that no two pieces of code that run at the same time can change the same value."
  },
  {
   "id": "view",
   "name": "View",
   "area": "ui",
   "needs": [
    "structure",
    "protocol",
    "opaque-type"
   ],
   "first": "A type that describes part of an app's user interface, built from its body."
  },
  {
   "id": "view-modifier",
   "name": "View modifier",
   "area": "ui",
   "needs": [
    "view"
   ],
   "first": "A method that returns a new view with one change, such as more space around it."
  },
  {
   "id": "view-builder",
   "name": "View builder",
   "area": "ui",
   "needs": [
    "view",
    "result-builder"
   ],
   "first": "The result builder that turns the views listed in a body into one view."
  },
  {
   "id": "state",
   "name": "State",
   "area": "ui",
   "needs": [
    "view",
    "property-wrapper"
   ],
   "first": "A property that SwiftUI keeps for a view, and that draws the view again when it changes."
  },
  {
   "id": "binding",
   "name": "Binding",
   "area": "ui",
   "needs": [
    "state",
    "projected-value"
   ],
   "first": "A way for a view to read and change a value that another view keeps."
  },
  {
   "id": "observable",
   "name": "Observable",
   "area": "ui",
   "needs": [
    "state",
    "class"
   ],
   "first": "A class whose properties SwiftUI watches, so a view that reads them is drawn again when they change."
  },
  {
   "id": "task-modifier",
   "name": "Task modifier",
   "area": "ui",
   "needs": [
    "view-modifier",
    "task"
   ],
   "first": "A modifier that starts a task when its view appears, and cancels the task when the view goes away."
  }
 ]
};
