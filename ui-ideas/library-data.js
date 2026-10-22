// Made by library/build.js from concepts/, known.json, and planned.json. Do not edit it: change those files, and run node library/build.js.
const LIBRARY = {
 "entries": {
  "active-phase": {
   "id": "active-phase",
   "name": "Active phase",
   "first": "The phase of a scene that is in the foreground, where a person can use it.",
   "parts": []
  },
  "any-keyword": {
   "id": "any-keyword",
   "name": "any",
   "first": "The keyword written before a protocol's name to make a boxed protocol type, which can hold a value of any type that conforms to the protocol.",
   "parts": []
  },
  "any-view": {
   "id": "any-view",
   "name": "Type-erased view",
   "area": "ui",
   "first": "A view that holds any other view and hides its type, so that code can give one type where different types of view are possible.",
   "parts": [],
   "dependsOn": [
    {
     "id": "view",
     "views": [
      "what"
     ],
     "why": "A type-erased view is a view that holds another view."
    },
    {
     "id": "opaque-type",
     "views": [
      "what"
     ],
     "why": "A view's body has an opaque type, which must be one real type, so a body that can give two types of view needs them to be one type."
    },
    {
     "id": "boxed-protocol-type",
     "views": [
      "what"
     ],
     "why": "A boxed protocol type of the view protocol is not itself a view, so it cannot be the type of a body, and a type-erased view is used instead."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Badge: View {",
     "    let isNew: Bool",
     "    var body: some View {",
     "        if isNew {",
     "            return AnyView(Text(\"New\"))",
     "        }",
     "        return AnyView(Image(systemName: \"star\"))",
     "    }",
     "}",
     "",
     "print(type(of: Badge(isNew: true).body))",
     "print(type(of: Badge(isNew: false).body))"
    ],
    "output": [
     "AnyView",
     "AnyView"
    ]
   },
   "views": {
    "what": {
     "is": "A type-erased view, `AnyView`, is a view that holds any other view. Its type is always `AnyView`, whichever view it holds, so code can give one type where different types of view are possible.",
     "marks": [
      {
       "line": 7,
       "text": "AnyView",
       "label": "holds a Text"
      },
      {
       "line": 9,
       "text": "AnyView",
       "label": "holds an Image"
      }
     ],
     "afterExample": "`body` returns a `Text` when `isNew` is true, and an `Image` when it is not. Wrapping each one in `AnyView` gives both the same type, so lines 13 and 14 both print {{AnyView}}.",
     "problem": "The type of `body` is an opaque type, so all of its return statements must return the same real type. A `Text` and an `Image` are two types, so without `AnyView` this `body` does not build. Giving `body` a boxed protocol type, the keyword any before `View`, does not build either, because a boxed protocol type of `View` does not itself conform to `View`.",
     "how": "`AnyView` keeps the view it is given, and hides that view's type. When SwiftUI draws an `AnyView`, it finds the type of the view inside while the app runs. Apple's documentation says that when that type changes, SwiftUI removes the old views and makes new ones, so the state inside them starts again.",
     "when": [
      {
       "text": "Use it when a value must hold one of several types of view that only the running app can tell apart, such as a view chosen from data that the app loads."
      },
      {
       "text": "Don't use it when an `if` statement in a view builder can choose between the views. `AnyView` hides the type from SwiftUI, so SwiftUI cannot tell that the view inside is the same as before, and its state can start again."
      }
     ]
    }
   }
  },
  "app": {
   "id": "app",
   "name": "App",
   "area": "ui",
   "first": "The type that a SwiftUI app starts from, whose body lists the app's scenes.",
   "parts": [
    "conformance",
    "scene-body",
    "main-attribute"
   ],
   "dependsOn": [
    {
     "id": "scene",
     "views": [
      "what"
     ],
     "why": "An app's body lists its scenes."
    },
    {
     "id": "structure",
     "views": [
      "what"
     ],
     "why": "An app is usually a structure."
    },
    {
     "id": "protocol",
     "views": [
      "what"
     ],
     "why": "An app is a type that conforms to SwiftUI's app protocol."
    },
    {
     "id": "opaque-type",
     "views": [
      "what"
     ],
     "why": "The type of an app's body is an opaque type that names the scene protocol."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct TripsApp: App {",
     "    var body: some Scene {",
     "        WindowGroup {",
     "            Text(\"Trips\")",
     "        }",
     "    }",
     "}",
     "",
     "let app = TripsApp()",
     "print(type(of: app.body))"
    ],
    "output": [
     "WindowGroup<Text>"
    ]
   },
   "snippets": {
    "main": {
     "app": true,
     "code": [
      "import SwiftUI",
      "",
      "@main",
      "struct TripsApp: App {",
      "    var body: some Scene {",
      "        WindowGroup {",
      "            Text(\"Trips\")",
      "        }",
      "    }",
      "}"
     ],
     "output": []
    }
   },
   "views": {
    "what": {
     "is": "An app is a type that conforms to the protocol `App`. Its `body` lists the scenes that the app has, such as a window group. In an app, it is the type that the app starts from.",
     "marks": [
      {
       "line": 3,
       "text": "App",
       "part": "conformance",
       "label": "an app"
      },
      {
       "line": 4,
       "text": "body",
       "part": "scene-body",
       "label": "its scenes"
      }
     ],
     "afterExample": "`TripsApp` has one scene, a window group that shows a `Text`. Line 12 reads its `body`, as SwiftUI does when the app starts, and prints {{WindowGroup<Text>}}.",
     "problem": "Every app needs a place to start, and a list of what it shows. In UIKit, an app delegate and a scene delegate made the windows in code. In SwiftUI, an app is a type whose `body` lists its scenes, and SwiftUI makes them.",
     "how": "The protocol `App` gives each app a static method that starts the app. When the app starts, SwiftUI makes an instance of the app's type, reads its `body`, and makes its scenes, which show their views.",
     "when": [
      {
       "text": "Use it once in each app, with the attribute `@main` before it. `@main` marks the type that the app starts from, and the system then calls the static method that `App` gives it, which starts the app:",
       "snippet": "main"
      },
      {
       "text": "Don't put the app's screens in it. Its `body` lists scenes, and each scene shows a view, which is where the screens are."
      }
     ]
    }
   }
  },
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
  "attached-macro": {
   "id": "attached-macro",
   "name": "Attached macro",
   "first": "A macro written with an at sign before a declaration, which adds code to that declaration when swiftc builds the program.",
   "parts": []
  },
  "await": {
   "id": "await",
   "name": "await",
   "first": "The keyword written before a call of an async function. It can be written only in code that can suspend.",
   "parts": []
  },
  "background-phase": {
   "id": "background-phase",
   "name": "Background phase",
   "first": "The phase of a scene that is not visible, which can come right before the app is ended.",
   "parts": []
  },
  "binding-property": {
   "id": "binding-property",
   "name": "Binding property",
   "first": "A property of a view marked with the Binding attribute, which keeps no value of its own, and reads and writes a value that another view keeps.",
   "parts": []
  },
  "binding": {
   "id": "binding",
   "name": "Binding",
   "area": "ui",
   "first": "A property wrapper that reads and writes a value that another view keeps, so that one view can change another view's state.",
   "parts": [
    "binding-property",
    "dollar-sign"
   ],
   "dependsOn": [
    {
     "id": "state",
     "views": [
      "what",
      "parts"
     ],
     "why": "A binding usually reads and writes the state of another view.",
     "whyInExample": "The binding in `NightsEditor` reads and writes `nights`, the state of `Planner`."
    },
    {
     "id": "projected-value",
     "views": [
      "what",
      "parts"
     ],
     "why": "A view gets a binding to its state by reading the state's projected value, with a dollar sign.",
     "whyInExample": "`$nights` reads the projected value of the state property `nights`, which is a binding to it."
    },
    {
     "id": "view-modifier",
     "views": [
      "parts"
     ],
     "why": "The example writes through the binding in the closure of a modifier that runs when a view appears.",
     "whyInExample": "`onAppear` is a modifier of the `Text` in `NightsEditor`, and its closure adds 1 to `nights`."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct NightsEditor: View {",
     "    @Binding var nights: Int",
     "    var body: some View {",
     "        Text(\"Nights: \\(nights)\")",
     "            .onAppear {",
     "                nights += 1",
     "            }",
     "    }",
     "}",
     "",
     "struct Planner: View {",
     "    @State private var nights = 3",
     "    var body: some View {",
     "        let _ = print(\"Planner has\", nights)",
     "        NightsEditor(nights: $nights)",
     "    }",
     "}",
     "",
     "let renderer = ImageRenderer(content: Planner())",
     "_ = renderer.cgImage"
    ]
   },
   "views": {
    "what": {
     "is": "A binding is a property marked `@Binding`. It holds no value of its own. Reading it reads a value that another view keeps, such as that view's state, and writing it writes that value.",
     "marks": [
      {
       "line": 4,
       "text": "@Binding var nights: Int",
       "part": "binding-property",
       "label": "binding"
      },
      {
       "line": 17,
       "text": "$",
       "part": "dollar-sign",
       "label": "a binding to the state"
      }
     ],
     "afterExample": "`Planner` keeps `nights` in state, and gives `NightsEditor` a binding to it. When `NightsEditor` adds 1 to its `nights`, the value that `Planner` keeps changes, and line 16 prints it.",
     "problem": "A value often belongs to one view but is changed in another, such as a number of nights that a planner keeps and an editor inside it changes. Passing the value itself would give the editor a copy, and the editor could change only that copy. A binding lets the editor change the planner's value, while the planner still keeps it.",
     "how": "The projected value of a state property is a binding to it, written with a dollar sign, as `$nights`. `NightsEditor` stores that binding in its `nights`. Reading or writing `nights` in `NightsEditor` reads or writes the state of `Planner`, so SwiftUI runs the `body` of `Planner` again when it changes.",
     "when": [
      {
       "text": "Use a binding in a view that changes a value it does not keep, such as an editor. SwiftUI's own controls, such as its toggles and text fields, take a binding for the value they change."
      },
      {
       "text": "Don't use a binding in a view that only shows a value. Pass the value itself, as a plain property, because the view never writes it."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "binding-property",
       "name": "The binding `nights`, line 4",
       "text": "The attribute `@Binding` makes `nights` a wrapped property of `Binding`, a property wrapper that SwiftUI provides. It has no first value, because it keeps no value: it reads and writes the value that the binding it is given refers to."
      },
      {
       "part": "dollar-sign",
       "name": "The dollar sign, in `$nights`, line 17",
       "text": "A dollar sign before the name of a state property reads the state's projected value, which is a binding to the state. Line 17 passes `$nights`, a binding to the `nights` of `Planner`, to the `nights` of `NightsEditor`."
      }
     ],
     "marks": [
      {
       "line": 4,
       "text": "@Binding var nights: Int",
       "part": "binding-property",
       "label": "binding"
      },
      {
       "line": 17,
       "text": "$",
       "part": "dollar-sign",
       "label": "binding to the state"
      }
     ],
     "steps": [
      {
       "text": "Line 21 makes a `Planner` and a renderer for it, and line 22 asks for the image, so SwiftUI draws `Planner`. Its state `nights` starts at 3.",
       "line": 21,
       "also": [
        22,
        14
       ]
      },
      {
       "text": "The `body` of `Planner` runs, and line 16 prints {{Planner has 3}}.",
       "line": 16,
       "prints": [
        "Planner has 3"
       ]
      },
      {
       "text": "Line 17 makes a `NightsEditor`, and gives it `$nights`, a binding to the state `nights` of `Planner`.",
       "line": 17,
       "also": [
        4
       ]
      },
      {
       "text": "SwiftUI draws `NightsEditor`, and its `Text` appears, so SwiftUI calls the closure of `onAppear`. Line 8 adds 1 to the binding `nights`, which writes 4 to the state of `Planner`.",
       "line": 8,
       "also": [
        7
       ]
      },
      {
       "text": "The state of `Planner` changed, so SwiftUI runs its `body` again, and line 16 prints {{Planner has 4}}.",
       "line": 16,
       "prints": [
        "Planner has 4"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "`NightsEditor` changed the value that `Planner` keeps, through the binding that line 17 gave it."
     }
    }
   }
  },
  "body-dependency": {
   "id": "body-dependency",
   "name": "Dependency of a body",
   "first": "A value that a view's body read the last time it ran, such as a state property, whose change makes SwiftUI run the body again.",
   "parts": []
  },
  "body": {
   "id": "body",
   "name": "Body",
   "first": "The code that runs each time a function or closure is called.",
   "parts": []
  },
  "boxed-protocol-type": {
   "id": "boxed-protocol-type",
   "name": "Boxed protocol type",
   "area": "swift",
   "first": "A type that can hold a value of any type that conforms to a protocol, whose real type is found only while the program runs. It is also called an existential type.",
   "parts": [
    "any-keyword"
   ],
   "dependsOn": [
    {
     "id": "protocol",
     "views": [
      "what",
      "parts"
     ],
     "why": "A boxed protocol type is written with a protocol's name, and holds values of the types that conform to it.",
     "whyInExample": "`any Shape` holds values of `Square` and `Strip`, the two types that conform to `Shape`."
    },
    {
     "id": "opaque-type",
     "views": [
      "what"
     ],
     "why": "A boxed protocol type is the other way to hide a value's type, and differs from an opaque type, which holds one real type."
    }
   ],
   "example": {
    "code": [
     "protocol Shape {",
     "    func area() -> Int",
     "}",
     "struct Square: Shape {",
     "    let side: Int",
     "    func area() -> Int {",
     "        return side * side",
     "    }",
     "}",
     "struct Strip: Shape {",
     "    let length: Int",
     "    func area() -> Int {",
     "        return length",
     "    }",
     "}",
     "let tiles: [any Shape] = [",
     "    Square(side: 3),",
     "    Strip(length: 5)",
     "]",
     "for tile in tiles {",
     "    print(type(of: tile), tile.area())",
     "}"
    ]
   },
   "views": {
    "what": {
     "is": "A boxed protocol type is written as `any` followed by a protocol's name. A value of this type can be a value of any type that conforms to the protocol, and its real type is found only while the program runs. Swift's documentation also calls it an existential type.",
     "marks": [
      {
       "line": 16,
       "text": "any Shape",
       "part": "any-keyword",
       "label": "any shape"
      }
     ],
     "afterExample": "The array `tiles` holds a `Square` and a `Strip`, two different types, because the type of its elements is `any Shape`.",
     "problem": "Code sometimes keeps values of different types together, such as the tiles of a floor, some square and some long. An array's elements all have one type. With `any Shape` as that type, each element can be a value of any type that conforms to `Shape`.",
     "how": "Each value of type `any Shape` is kept together with its real type. When code calls `area()` on it, the program finds the real type while it runs, and calls the `area()` of that type.",
     "when": [
      {
       "text": "Use one when a value's type can differ from value to value, or change over time, such as the elements of `tiles`."
      },
      {
       "text": "Don't use one when every value has the same real type. An opaque type, written with the keyword some, keeps that one type, so swiftc knows it."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "any-keyword",
       "name": "The keyword `any`, line 16",
       "text": "The keyword `any` before `Shape` makes `any Shape` a boxed protocol type. The array's type, `[any Shape]`, lets each element be a value of a different type that conforms to `Shape`."
      }
     ],
     "marks": [
      {
       "line": 16,
       "text": "any",
       "part": "any-keyword",
       "label": "keyword"
      }
     ],
     "steps": [
      {
       "text": "Lines 16 to 19 make an array of two elements, a `Square` whose `side` is 3 and a `Strip` whose `length` is 5, and store it in `tiles`. Each element keeps its real type.",
       "line": 16,
       "also": [
        17,
        18
       ]
      },
      {
       "text": "The loop on line 20 takes the first element. Line 21 prints its real type, `Square`, and calls `area()`, which runs the `area()` of `Square` on line 7: {{Square 9}}.",
       "line": 21,
       "also": [
        20,
        7
       ],
       "prints": [
        "Square 9"
       ]
      },
      {
       "text": "The loop takes the second element. This time `area()` runs the `area()` of `Strip` on line 13, and line 21 prints {{Strip 5}}.",
       "line": 21,
       "also": [
        13
       ],
       "prints": [
        "Strip 5"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "Each element of `[any Shape]` keeps its own real type, and the call of `area()` on line 21 runs the method of that type."
     }
    }
   }
  },
  "braces": {
   "id": "braces",
   "name": "Braces",
   "first": "The two brace characters that mark where a closure starts and where it ends. Everything between them belongs to the closure.",
   "parts": []
  },
  "build-block": {
   "id": "build-block",
   "name": "Build block method",
   "first": "The static method of a result builder that combines the values of one block of code into one value.",
   "parts": []
  },
  "builder-attribute": {
   "id": "builder-attribute",
   "name": "Builder attribute",
   "first": "A result builder's name written as an attribute before a function, a property, or a closure's parameter, which makes swiftc build its body with that builder.",
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
  "custom-layout": {
   "id": "custom-layout",
   "name": "Custom layout",
   "area": "ui",
   "first": "A type of your own that sizes and places the views inside it by a rule that SwiftUI's own containers do not have.",
   "parts": [
    "conformance",
    "size-that-fits",
    "place-subviews"
   ],
   "dependsOn": [
    {
     "id": "layout-process",
     "views": [
      "what",
      "parts"
     ],
     "why": "A custom layout is the parent in the steps of layout: it chooses its own size, and proposes a size to each view and places it.",
     "whyInExample": "`place(at:proposal:)` proposes `step`, 30 by 30, to each color, as each renderer proposes a size on the page of Layout process."
    },
    {
     "id": "protocol",
     "views": [
      "what",
      "parts"
     ],
     "why": "A custom layout is a type that conforms to SwiftUI's layout protocol.",
     "whyInExample": "`Stairs` conforms to the protocol `Layout`, and has the two methods that it requires."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Stairs: Layout {",
     "    func sizeThatFits(",
     "        proposal: ProposedViewSize,",
     "        subviews: Subviews,",
     "        cache: inout ()",
     "    ) -> CGSize {",
     "        let side = 30.0 * Double(subviews.count)",
     "        return CGSize(width: side, height: side)",
     "    }",
     "    func placeSubviews(",
     "        in bounds: CGRect,",
     "        proposal: ProposedViewSize,",
     "        subviews: Subviews,",
     "        cache: inout ()",
     "    ) {",
     "        var corner = bounds.origin",
     "        for view in subviews {",
     "            view.place(at: corner, proposal: step)",
     "            corner.x += 30",
     "            corner.y += 30",
     "        }",
     "    }",
     "}",
     "",
     "let step = ProposedViewSize(width: 30, height: 30)",
     "let stairs = Stairs {",
     "    Color.blue",
     "    Color.green",
     "    Color.red",
     "}",
     "let renderer = ImageRenderer(content: stairs)",
     "let image = renderer.cgImage!",
     "print(image.width, image.height)"
    ]
   },
   "views": {
    "what": {
     "is": "A custom layout is a type that conforms to the protocol `Layout`. It is the parent in the steps of layout: its method `sizeThatFits` chooses its size, and its method `placeSubviews` places each view inside it, with a proposal for that view's size. Used with braces, as on line 28, it lays out the views listed in them.",
     "marks": [
      {
       "line": 3,
       "text": "Layout",
       "part": "conformance",
       "label": "a layout"
      },
      {
       "line": 4,
       "text": "sizeThatFits",
       "part": "size-that-fits",
       "label": "chooses its size"
      },
      {
       "line": 12,
       "text": "placeSubviews",
       "part": "place-subviews",
       "label": "places each view"
      }
     ],
     "afterExample": "`Stairs` makes each view 30 by 30 points, and places each one 30 points further right and further down than the one before. Three views make stairs of 90 by 90.",
     "problem": "Stacks and grids cover most layouts, but not every one, such as a row of chips that wraps onto the next line, or views in a circle. A custom layout writes that rule once, and any views can use it.",
     "how": "SwiftUI calls `sizeThatFits` with the proposal from the layout's parent, and with the views inside it, as `subviews`, and uses the size it returns. Then it calls `placeSubviews` with `bounds`, the space that the layout got, and the layout calls `place(at:proposal:)` on each view, which gives the view a proposal and a place.",
     "when": [
      {
       "text": "Use one for a rule of placement that stacks and grids cannot express, such as a row that wraps, or stairs."
      },
      {
       "text": "Don't use one when a stack or a grid does the job: they are already written, and they handle spacing and alignment for you."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "conformance",
       "name": "The conformance to `Layout`, line 3",
       "text": "The colon and the name `Layout` after `Stairs` say that `Stairs` conforms to the protocol `Layout`, which requires two methods, `sizeThatFits` and `placeSubviews`. Their last parameter, `cache`, can keep values between calls. `Stairs` keeps none, so the type of `cache` is `inout ()`, an empty value."
      },
      {
       "part": "size-that-fits",
       "name": "The method `sizeThatFits`, lines 4 to 11",
       "text": "The method `sizeThatFits` returns the size that the layout chooses. It gets the proposal from its parent, and `subviews`, the views inside the layout. Line 9 multiplies 30 by the number of views, and line 10 returns a square of that side, whatever the proposal."
      },
      {
       "part": "place-subviews",
       "name": "The method `placeSubviews`, lines 12 to 24",
       "text": "The method `placeSubviews` gets `bounds`, the space that the layout got, and places each view in it. Line 18 starts at the top leading corner of `bounds`. For each view, line 20 calls `place(at:proposal:)`, which puts the view at `corner` and proposes it `step`, 30 by 30, from line 27. Lines 21 and 22 move `corner` 30 points right and 30 points down."
      }
     ],
     "marks": [
      {
       "line": 3,
       "text": "Layout",
       "part": "conformance",
       "label": "conformance"
      },
      {
       "line": 4,
       "text": "sizeThatFits",
       "part": "size-that-fits",
       "label": "sizing method"
      },
      {
       "line": 12,
       "text": "placeSubviews",
       "part": "place-subviews",
       "label": "placing method"
      },
      {
       "line": 20,
       "text": "place(at: corner, proposal: step)",
       "part": "place-subviews",
       "label": "places one view"
      }
     ],
     "steps": [
      {
       "text": "Line 27 makes `step`, a proposal of 30 by 30, and line 28 makes a `Stairs` that lays out the three colors listed in its braces.",
       "line": 28,
       "also": [
        27,
        29
       ]
      },
      {
       "text": "Line 33 makes a renderer, and line 34 asks for the image, so SwiftUI lays out `stairs`.",
       "line": 34,
       "also": [
        33
       ]
      },
      {
       "text": "SwiftUI calls `sizeThatFits`. There are 3 views, so line 9 works out 90, and line 10 chooses 90 by 90.",
       "line": 10,
       "also": [
        4,
        9
       ]
      },
      {
       "text": "SwiftUI calls `placeSubviews`. Line 20 places the blue color at the top leading corner, proposed `step`, the green one 30 points right and down from it, and the red one 60 points right and down.",
       "line": 20,
       "also": [
        18,
        21,
        22
       ]
      },
      {
       "text": "Line 35 prints the size of the image, which is the size that `Stairs` chose: {{90 90}}.",
       "line": 35,
       "prints": [
        "90 90"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "`Stairs` chose its own size from the number of its views, and placed each one by its own rule, one step down and to the right."
     }
    }
   }
  },
  "custom-modifier": {
   "id": "custom-modifier",
   "name": "Custom modifier",
   "area": "ui",
   "first": "A type of your own that applies the same modifiers to any view, so that they can be used again under one name.",
   "parts": [
    "conformance",
    "modifier-body",
    "modifier-call"
   ],
   "dependsOn": [
    {
     "id": "view-modifier",
     "views": [
      "what",
      "parts"
     ],
     "why": "A custom modifier is applied as a modifier, and returns a new view around the view it is applied to.",
     "whyInExample": "`modifier(Tile())` returns a new view around the `Text`, as `padding(8)` returns a new view around `city`."
    },
    {
     "id": "protocol",
     "views": [
      "what",
      "parts"
     ],
     "why": "A custom modifier is a type that conforms to SwiftUI's view modifier protocol.",
     "whyInExample": "`Tile` conforms to the protocol `ViewModifier`, and has the method `body(content:)` that it requires."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Tile: ViewModifier {",
     "    func body(content: Content) -> some View {",
     "        let _ = print(\"Tile adds its padding\")",
     "        content",
     "            .padding(10)",
     "            .background(Color.gray)",
     "    }",
     "}",
     "",
     "let card = Text(\"Lima\").modifier(Tile())",
     "print(type(of: card))",
     "let renderer = ImageRenderer(content: card)",
     "_ = renderer.cgImage"
    ]
   },
   "views": {
    "what": {
     "is": "A custom modifier is a type that conforms to the protocol `ViewModifier`. Its method `body(content:)` gets the view that it is applied to, as `content`, and returns that view with the modifiers it adds. Calling `modifier(Tile())` on any view applies them.",
     "marks": [
      {
       "line": 3,
       "text": "ViewModifier",
       "part": "conformance",
       "label": "a modifier"
      },
      {
       "line": 4,
       "text": "body(content: Content)",
       "part": "modifier-body",
       "label": "what it adds"
      },
      {
       "line": 12,
       "text": "modifier(Tile())",
       "part": "modifier-call",
       "label": "applies it"
      }
     ],
     "afterExample": "`Tile` adds padding and a gray background. Line 12 applies it to a `Text`, and the new view holds the text and `Tile`.",
     "problem": "The same few modifiers are often repeated on many views, such as the padding and background of every tile. Written out each time, they can drift apart when one copy changes. A custom modifier names them once, and every view uses that name.",
     "how": "Calling `modifier(Tile())` returns a new view that holds the view and the modifier, as every modifier does. When SwiftUI draws it, it calls `body(content:)` of `Tile`, with the view as `content`, and draws the view that `body(content:)` returns.",
     "when": [
      {
       "text": "Use one for a group of modifiers that several views share, such as the style of a tile or a chip."
      },
      {
       "text": "Don't make one for a single modifier that is used once: calling that modifier is shorter."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "conformance",
       "name": "The conformance to `ViewModifier`, line 3",
       "text": "The colon and the name `ViewModifier` after `Tile` say that `Tile` conforms to the protocol `ViewModifier`, which requires one method, `body(content:)`."
      },
      {
       "part": "modifier-body",
       "name": "The method `body(content:)`, lines 4 to 9",
       "text": "The method `body(content:)` gets the view that `Tile` is applied to, as its parameter `content`, and returns the new view. Lines 6 to 8 return `content` with 10 points of padding, and a gray background behind both."
      },
      {
       "part": "modifier-call",
       "name": "The call `modifier(Tile())`, line 12",
       "text": "The modifier `modifier` applies a custom modifier to a view. Line 12 applies a new `Tile` to a `Text`."
      }
     ],
     "marks": [
      {
       "line": 3,
       "text": "ViewModifier",
       "part": "conformance",
       "label": "conformance"
      },
      {
       "line": 4,
       "text": "body(content: Content)",
       "part": "modifier-body",
       "label": "modifier body"
      },
      {
       "line": 12,
       "text": "modifier(Tile())",
       "part": "modifier-call",
       "label": "applies it"
      }
     ],
     "steps": [
      {
       "text": "Line 12 makes a `Text`, and calls `modifier(Tile())` on it. That returns a new view that holds the text and a `Tile`, which line 12 stores in `card`.",
       "line": 12
      },
      {
       "text": "Line 13 prints the type of `card`: {{ModifiedContent<Text, Tile>}}. The method of `Tile` has not run yet.",
       "line": 13,
       "prints": [
        "ModifiedContent<Text, Tile>"
       ]
      },
      {
       "text": "Line 14 makes a renderer for `card`, and line 15 asks for the image, so SwiftUI draws it.",
       "line": 14,
       "also": [
        15
       ]
      },
      {
       "text": "SwiftUI calls `body(content:)` of `Tile`, with the text as `content`, and line 5 prints {{Tile adds its padding}}.",
       "line": 5,
       "also": [
        4
       ],
       "prints": [
        "Tile adds its padding"
       ]
      },
      {
       "text": "Lines 6 to 8 return the text with padding and a gray background, which SwiftUI draws in place of the plain text.",
       "line": 6,
       "also": [
        7,
        8
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "Applying `Tile` made a new view at once, and SwiftUI ran its `body(content:)` when it drew that view."
     }
    }
   }
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
  "dynamic-member-lookup-attribute": {
   "id": "dynamic-member-lookup-attribute",
   "name": "Dynamic member lookup attribute",
   "first": "The attribute, written with an at sign before the declaration of a type, that lets code use member names that the type does not declare.",
   "parts": []
  },
  "dynamic-member-lookup": {
   "id": "dynamic-member-lookup",
   "name": "Dynamic member lookup",
   "area": "swift",
   "first": "A way for code to read a member of a type by a name that the type does not declare, which swiftc turns into a call of one subscript of the type with the name as a string.",
   "parts": [
    "dynamic-member-lookup-attribute",
    "dynamic-member-subscript",
    "dynamic-member"
   ],
   "dependsOn": [
    {
     "id": "function",
     "views": [
      "what",
      "parts"
     ],
     "why": "A dynamic member subscript takes a parameter, runs its body, and returns a value, as a function does."
    }
   ],
   "example": {
    "code": [
     "@dynamicMemberLookup",
     "struct Settings {",
     "    var values = [\"volume\": 7, \"brightness\": 4]",
     "    subscript(dynamicMember key: String) -> Int {",
     "        return values[key] ?? 0",
     "    }",
     "}",
     "let settings = Settings()",
     "print(settings.volume)",
     "print(settings.brightness)",
     "print(settings.contrast)"
    ],
    "sil": [
     {
      "in": "main",
      "has": "string_literal utf8 \"volume\"",
      "shows": "Line 9 makes the name volume into a string, which the program keeps as text."
     },
     {
      "in": "main",
      "has": "function_ref Settings.subscript.getter",
      "shows": "Reading settings.volume calls the subscript of Settings."
     }
    ]
   },
   "snippets": {
    "typo": {
     "code": [
      "@dynamicMemberLookup",
      "struct Settings {",
      "    var values = [\"volume\": 7, \"brightness\": 4]",
      "    subscript(dynamicMember key: String) -> Int {",
      "        return values[key] ?? 0",
      "    }",
      "}",
      "let settings = Settings()",
      "print(settings.volum)  // 0, not 7"
     ],
     "output": [
      "0"
     ]
    }
   },
   "views": {
    "what": {
     "is": "Dynamic member lookup lets code read a member of a type by a name that the type does not declare. swiftc turns each such name into a call of one subscript of the type, with the name as a string, and the subscript works out the value.",
     "marks": [
      {
       "line": 1,
       "text": "@dynamicMemberLookup",
       "part": "dynamic-member-lookup-attribute",
       "label": "allows undeclared names"
      },
      {
       "line": 9,
       "text": "volume",
       "part": "dynamic-member",
       "label": "not declared"
      }
     ],
     "afterExample": "`Settings` declares no property named `volume`, yet line 9 reads `settings.volume` and prints {{7}}. The subscript on line 4 looks up `\"volume\"` in `values`.",
     "problem": "Some values have members whose names are known only when the program runs, such as the keys of a dictionary read from a file. Without dynamic member lookup, code reads them with a string in square brackets. With it, code reads them with a dot and a name, as it reads a property.",
     "how": "When swiftc finds a name after a dot that the type does not declare, it builds a call of the type's subscript whose argument label is `dynamicMember`, and passes the name as a string. So line 9 runs the subscript with `key` set to `\"volume\"`.",
     "when": [
      {
       "text": "Use it when a type's members come from data, such as a dictionary, and code should read them with a dot and a name."
      },
      {
       "text": "Don't use it when the names are known as you write the code. A property for each name lets swiftc check the name. With dynamic member lookup, a misspelled name still builds:",
       "snippet": "typo"
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "dynamic-member-lookup-attribute",
       "name": "The attribute `@dynamicMemberLookup`",
       "text": "An attribute starts with an at sign, and gives swiftc more information about the declaration after it. On line 1, the attribute `@dynamicMemberLookup` lets code write member names after a dot that `Settings` does not declare. swiftc then checks that `Settings` has a subscript whose argument label is `dynamicMember`: without one, line 1 does not build."
      },
      {
       "part": "dynamic-member-subscript",
       "name": "The dynamic member subscript, lines 4 to 6",
       "text": "Lines 4 to 6 are the subscript that a type with dynamic member lookup must have. A subscript is code that runs when a value is read with square brackets, as `values[key]` is on line 5. This one's argument label is `dynamicMember`, and its parameter, `key`, gets each member name as a `String`. Its return type, `Int`, is the type of every dynamic member. Line 5 returns the value for `key` in `values`, and `??` gives 0 when `values` has no value for `key`."
      },
      {
       "part": "dynamic-member",
       "name": "The dynamic members, lines 9 to 11",
       "text": "On lines 9 to 11, the names `volume`, `brightness`, and `contrast` are written after a dot, as properties are, but `Settings` declares none of them. Each one is a dynamic member. When swiftc builds the program, it turns `settings.volume` into a call of the subscript, with `\"volume\"` as its argument. A name that is not a key in `values`, such as `contrast`, still builds."
      }
     ],
     "marks": [
      {
       "line": 1,
       "text": "@dynamicMemberLookup",
       "part": "dynamic-member-lookup-attribute",
       "label": "attribute"
      },
      {
       "line": 4,
       "text": "subscript(dynamicMember key: String) -> Int",
       "part": "dynamic-member-subscript",
       "label": "dynamic member subscript"
      },
      {
       "line": 9,
       "text": "volume",
       "part": "dynamic-member",
       "label": "dynamic member"
      },
      {
       "line": 10,
       "text": "brightness",
       "part": "dynamic-member",
       "label": "dynamic member"
      },
      {
       "line": 11,
       "text": "contrast",
       "part": "dynamic-member",
       "label": "dynamic member"
      }
     ],
     "steps": [
      {
       "text": "Line 8 makes a `Settings`, and stores it in `settings`. Its `values` holds 7 for `\"volume\"` and 4 for `\"brightness\"`.",
       "line": 8,
       "also": [
        3
       ]
      },
      {
       "text": "Line 9 reads `settings.volume`. `Settings` declares no member named `volume`, so this is a call of the subscript on line 4, with `key` set to `\"volume\"`.",
       "line": 9,
       "also": [
        4
       ]
      },
      {
       "text": "Line 5 returns the value for `\"volume\"` in `values`, which is 7.",
       "line": 5,
       "value": {
        "line": 5,
        "name": "key",
        "is": "\"volume\""
       }
      },
      {
       "text": "Line 9 prints {{7}}.",
       "line": 9,
       "prints": [
        "7"
       ]
      },
      {
       "text": "Line 10 reads `settings.brightness`, so the subscript runs again, with `key` set to `\"brightness\"`. Line 5 returns 4, and line 10 prints {{4}}.",
       "line": 10,
       "also": [
        5
       ],
       "value": {
        "line": 5,
        "name": "key",
        "is": "\"brightness\""
       },
       "prints": [
        "4"
       ]
      },
      {
       "text": "Line 11 reads `settings.contrast`, and the subscript runs with `key` set to the string \"contrast\". `values` has no value for it, so `??` on line 5 gives 0, and line 11 prints {{0}}.",
       "line": 11,
       "also": [
        5
       ],
       "value": {
        "line": 5,
        "name": "key",
        "is": "\"contrast\""
       },
       "prints": [
        "0"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "`Settings` declares no `volume`. swiftc turns `settings.volume` into a call of the dynamic member subscript with `\"volume\"`, and the subscript returns the value."
     }
    }
   }
  },
  "dynamic-member-subscript": {
   "id": "dynamic-member-subscript",
   "name": "Dynamic member subscript",
   "first": "The subscript that a type with dynamic member lookup must have, which swiftc calls with each member name that the type does not declare.",
   "parts": []
  },
  "dynamic-member": {
   "id": "dynamic-member",
   "name": "Dynamic member",
   "first": "A member name, written after a dot, that a type with dynamic member lookup does not declare, which swiftc turns into a call of the type's dynamic member subscript with the name as a string.",
   "parts": []
  },
  "environment-modifier": {
   "id": "environment-modifier",
   "name": "Environment modifier",
   "first": "The modifier that sets one environment value, named by a key path, for the view it is called on and every view inside it.",
   "parts": []
  },
  "environment-property": {
   "id": "environment-property",
   "name": "Environment property",
   "first": "A property of a view marked with the Environment attribute and a key path, which reads one value from the environment that SwiftUI keeps for the view.",
   "parts": []
  },
  "environment": {
   "id": "environment",
   "name": "Environment",
   "area": "ui",
   "first": "Values that SwiftUI passes from a view to every view inside it, such as whether views are enabled, without passing them through each view's initializer.",
   "parts": [
    "environment-property",
    "environment-modifier"
   ],
   "dependsOn": [
    {
     "id": "view",
     "views": [
      "what",
      "parts"
     ],
     "why": "The environment passes values from a view to the views inside it.",
     "whyInExample": "`SaveLabel` is a view inside `Toolbar`, and reads a value from its environment."
    },
    {
     "id": "key-path",
     "views": [
      "what",
      "parts"
     ],
     "why": "Each environment value is named by a key path to a property of SwiftUI's environment values.",
     "whyInExample": "`\\.isEnabled` is a key path to the property `isEnabled` of the environment values, as `\\Trip.nights` is a key path to `nights`."
    },
    {
     "id": "property-wrapper",
     "views": [
      "parts"
     ],
     "why": "A view reads the environment through a property wrapper that SwiftUI provides.",
     "whyInExample": "`@Environment` before `isEnabled` makes it a wrapped property of the property wrapper `Environment`."
    },
    {
     "id": "view-modifier",
     "views": [
      "what",
      "parts"
     ],
     "why": "A view sets an environment value with a modifier.",
     "whyInExample": "`environment(\\.isEnabled, false)` is a modifier that returns a new view around `Toolbar`."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct SaveLabel: View {",
     "    @Environment(\\.isEnabled) var isEnabled",
     "    var body: some View {",
     "        let _ = print(\"isEnabled:\", isEnabled)",
     "        Text(\"Save\")",
     "    }",
     "}",
     "",
     "struct Toolbar: View {",
     "    var body: some View {",
     "        SaveLabel()",
     "    }",
     "}",
     "",
     "let normal = ImageRenderer(content: Toolbar())",
     "_ = normal.cgImage",
     "let off = Toolbar()",
     "    .environment(\\.isEnabled, false)",
     "let turnedOff = ImageRenderer(content: off)",
     "_ = turnedOff.cgImage"
    ]
   },
   "views": {
    "what": {
     "is": "The environment is a set of values that SwiftUI passes from a view to every view inside it. A view reads one value with a property marked `@Environment`, and sets one, for the views inside it, with the modifier `environment`. The system sets many of the values, such as the color scheme.",
     "marks": [
      {
       "line": 4,
       "text": "@Environment(\\.isEnabled) var isEnabled",
       "part": "environment-property",
       "label": "reads a value"
      },
      {
       "line": 20,
       "text": "environment(\\.isEnabled, false)",
       "part": "environment-modifier",
       "label": "sets a value"
      }
     ],
     "afterExample": "`Toolbar` never mentions `isEnabled`, but `SaveLabel` inside it still reads the value that line 20 sets on `Toolbar`.",
     "problem": "Some values matter to many views deep inside a screen, such as whether controls are enabled, or the reader's language. Passing them through the initializer of every view on the way would add a parameter to views that never use it. The environment passes them past those views.",
     "how": "Apple's documentation says that a value set with `environment` applies to the view it is called on and every view inside it, up to a place that sets the value again. A property marked `@Environment` reads one value, named by a key path, and SwiftUI updates the view when that value changes.",
     "when": [
      {
       "text": "Use it for a value that many views inside one part of the app need, or that the system sets, such as whether controls are enabled."
      },
      {
       "text": "Don't use it for a value that one view gives to the view right inside it. A plain parameter shows where the value comes from."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "environment-property",
       "name": "The environment property `isEnabled`, line 4",
       "text": "The attribute `@Environment`, with the key path `\\.isEnabled`, makes `isEnabled` read one environment value: whether views are enabled. This key path leaves out the type's name, because swiftc knows that it starts from SwiftUI's environment values. The property reads the value that SwiftUI keeps for this view, and cannot set it."
      },
      {
       "part": "environment-modifier",
       "name": "The modifier `environment`, line 20",
       "text": "The modifier `environment` sets one environment value, named by a key path, for the view it is called on and every view inside it. Line 20 sets `isEnabled` to false for `Toolbar`, and so for `SaveLabel` inside it."
      }
     ],
     "marks": [
      {
       "line": 4,
       "text": "@Environment(\\.isEnabled) var isEnabled",
       "part": "environment-property",
       "label": "environment property"
      },
      {
       "line": 20,
       "text": "environment(\\.isEnabled, false)",
       "part": "environment-modifier",
       "label": "environment modifier"
      }
     ],
     "steps": [
      {
       "text": "Line 17 makes a `Toolbar` and a renderer for it, and line 18 asks for the image, so SwiftUI draws `Toolbar`.",
       "line": 17,
       "also": [
        18
       ]
      },
      {
       "text": "The `body` of `Toolbar` makes a `SaveLabel`, and passes it nothing.",
       "line": 13
      },
      {
       "text": "SwiftUI draws `SaveLabel`. Nothing set `isEnabled`, so it reads the default value, true, and line 6 prints {{isEnabled: true}}.",
       "line": 6,
       "also": [
        4
       ],
       "prints": [
        "isEnabled: true"
       ]
      },
      {
       "text": "Line 19 makes another `Toolbar`, and line 20 calls `environment` on it, which sets `isEnabled` to false for it and every view inside it. Line 21 makes a renderer for it, and line 22 asks for its image.",
       "line": 20,
       "also": [
        19,
        21,
        22
       ]
      },
      {
       "text": "`SaveLabel` is inside that `Toolbar`, so its `isEnabled` reads false, and line 6 prints {{isEnabled: false}}. `Toolbar` never passed the value on.",
       "line": 6,
       "prints": [
        "isEnabled: false"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The value that line 20 set on `Toolbar` reached `SaveLabel` inside it, through the environment, without a parameter."
     }
    }
   }
  },
  "fixed-frame": {
   "id": "fixed-frame",
   "name": "Fixed frame",
   "first": "A frame with a width, a height, or both, which chooses that size whatever it is proposed.",
   "parts": []
  },
  "flexible-frame": {
   "id": "flexible-frame",
   "name": "Flexible frame",
   "first": "A frame with a smallest or a largest width or height, which lets its size change with the proposal, but only between those limits.",
   "parts": []
  },
  "frame": {
   "id": "frame",
   "name": "Frame",
   "area": "ui",
   "first": "A modifier that puts a view inside an invisible view of a given size, or of a size between a smallest and a largest, and places the view inside it.",
   "parts": [
    "fixed-frame",
    "flexible-frame"
   ],
   "dependsOn": [
    {
     "id": "view-modifier",
     "views": [
      "what",
      "parts"
     ],
     "why": "A frame is a modifier, which returns a new view around the view it is called on.",
     "whyInExample": "`frame(width: 80, height: 40)` returns a new view around the color, as `padding(8)` returns a new view around `city`."
    },
    {
     "id": "layout-process",
     "views": [
      "what",
      "parts"
     ],
     "why": "A frame takes part in the steps of layout: it proposes a size to the view inside it, and chooses its own.",
     "whyInExample": "Line 13 proposes 300 by 200 to the frame, as the renderers propose 300 by 200 on the page of Layout process."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "let fixed = Color.blue",
     "    .frame(width: 80, height: 40)",
     "let small = ImageRenderer(content: fixed)",
     "let first = small.cgImage!",
     "print(first.width, first.height)",
     "",
     "let capped = Color.blue",
     "    .frame(maxWidth: 100)",
     "let wide = ImageRenderer(content: capped)",
     "let size = CGSize(width: 300, height: 200)",
     "wide.proposedSize = ProposedViewSize(size)",
     "let second = wide.cgImage!",
     "print(second.width, second.height)"
    ]
   },
   "views": {
    "what": {
     "is": "A frame is a modifier that puts a view inside an invisible view of a given size. `frame(width: 80, height: 40)` makes a view of exactly 80 by 40 points. `frame(maxWidth: 100)` makes a view at most 100 points across, which in the other direction lets the view inside choose.",
     "marks": [
      {
       "line": 4,
       "text": "frame(width: 80, height: 40)",
       "part": "fixed-frame",
       "label": "always 80 by 40"
      },
      {
       "line": 10,
       "text": "frame(maxWidth: 100)",
       "part": "flexible-frame",
       "label": "at most 100 across"
      }
     ],
     "afterExample": "The first frame is 80 by 40, whatever it is proposed. The second is proposed 300 by 200, and chooses at most 100 across, and the whole 200 down.",
     "problem": "Sometimes a view must have a set size, or must not grow past one, such as a picture 80 points wide, or a column of text no wider than 600 points. A frame gives a view that size, without changing the view.",
     "how": "In the steps of layout, the frame is the parent of the view it holds. A frame with a width and a height chooses that size, and proposes it to the view inside. A frame with a largest width proposes no more than that width to the view inside, and in a direction it gives no size for, passes on the proposal it got.",
     "when": [
      {
       "text": "Use a fixed frame for a view that must be one size, and a frame with a smallest or a largest size for a view that should grow or shrink only so far."
      },
      {
       "text": "Don't use a frame to make a view's content bigger. A frame changes the space around the view: a text in a large frame keeps the size of its font."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "fixed-frame",
       "name": "The fixed frame, line 4",
       "text": "The modifier `frame(width: 80, height: 40)` returns a view that is always 80 by 40 points. It proposes that size to the color inside it, and the color chooses all of it."
      },
      {
       "part": "flexible-frame",
       "name": "The frame with a largest width, line 10",
       "text": "The modifier `frame(maxWidth: 100)` returns a view that is never wider than 100 points. It gives no height, so in that direction it passes on the proposal, and the color takes the whole height."
      }
     ],
     "marks": [
      {
       "line": 4,
       "text": "frame(width: 80, height: 40)",
       "part": "fixed-frame",
       "label": "fixed frame"
      },
      {
       "line": 10,
       "text": "frame(maxWidth: 100)",
       "part": "flexible-frame",
       "label": "flexible frame"
      }
     ],
     "steps": [
      {
       "text": "Lines 3 and 4 make a color in a frame of 80 by 40, and line 5 makes a renderer for it.",
       "line": 4,
       "also": [
        3,
        5
       ]
      },
      {
       "text": "Line 6 asks for the image. The frame chooses 80 by 40, and proposes that size to the color, which takes it. Line 7 prints {{80 40}}.",
       "line": 7,
       "also": [
        6
       ],
       "prints": [
        "80 40"
       ]
      },
      {
       "text": "Lines 9 and 10 make a color in a frame whose largest width is 100. Line 11 makes a renderer for it, and line 13 proposes 300 by 200, the size on line 12.",
       "line": 10,
       "also": [
        9,
        11,
        12,
        13
       ]
      },
      {
       "text": "The frame proposes 100 points across to the color, and the whole 200 points down. The color takes both, and the frame chooses the same, so line 15 prints {{100 200}}.",
       "line": 15,
       "also": [
        14
       ],
       "prints": [
        "100 200"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The fixed frame chose its own size. The flexible frame chose from the proposal, but no more than its largest width."
     }
    }
   }
  },
  "freestanding-macro": {
   "id": "freestanding-macro",
   "name": "Freestanding macro",
   "first": "A macro written with a number sign before its name, which swiftc replaces, where it is written, with the code that the macro expands to.",
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
  "geometry-proxy": {
   "id": "geometry-proxy",
   "name": "Geometry proxy",
   "first": "The value that a geometry reader gives its content, which holds the size that the reader chose.",
   "parts": []
  },
  "geometry-reader": {
   "id": "geometry-reader",
   "name": "Geometry reader",
   "area": "ui",
   "first": "A view that takes all the space proposed to it, and gives its content that size, so that the content can use the numbers.",
   "parts": [
    "geometry-proxy"
   ],
   "dependsOn": [
    {
     "id": "layout-process",
     "views": [
      "what",
      "parts"
     ],
     "why": "A geometry reader takes part in the steps of layout, and passes its chosen size on to its content.",
     "whyInExample": "Line 11 proposes 300 by 200 to the reader, as the renderers propose 300 by 200 on the page of Layout process."
    },
    {
     "id": "closure",
     "views": [
      "what",
      "parts"
     ],
     "why": "The content of a geometry reader is a closure, which SwiftUI calls with the reader's size.",
     "whyInExample": "The braces after `GeometryReader` hold a closure whose parameter is `proxy`."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "let reader = GeometryReader { proxy in",
     "    Color.blue",
     "        .onAppear {",
     "            print(\"proposed\", proxy.size)",
     "        }",
     "}",
     "let size = CGSize(width: 300, height: 200)",
     "let renderer = ImageRenderer(content: reader)",
     "renderer.proposedSize = ProposedViewSize(size)",
     "let image = renderer.cgImage!",
     "print(image.width, image.height)"
    ]
   },
   "views": {
    "what": {
     "is": "A geometry reader is a view whose content is a closure. SwiftUI calls the closure with a geometry proxy, a value that holds the reader's own size, so the content can use that size. Apple's documentation says that the reader returns a flexible size to its parent: it takes all the space it is proposed.",
     "marks": [
      {
       "line": 3,
       "text": "GeometryReader",
       "label": "geometry reader"
      },
      {
       "line": 3,
       "text": "proxy",
       "part": "geometry-proxy",
       "label": "its size"
      }
     ],
     "afterExample": "The reader is proposed 300 by 200 points, takes all of it, and gives its content that size through `proxy`.",
     "problem": "Sometimes a view must know its size in numbers, such as a bar whose width is a share of the space, or a drawing that scales to fit. Layout gives sizes to views, not to code. A geometry reader gives its size to the code of its content.",
     "how": "In the steps of layout, the reader chooses the whole size it is proposed. It then calls its closure with a proxy that holds that size, and lays out the views that the closure returns inside it.",
     "when": [
      {
       "text": "Use it when a view's content must be sized as a share of the space, such as a bar that is 40 percent as wide as its container."
      },
      {
       "text": "Don't use it only to read the size of a view that should choose its own. The reader takes all the space it is proposed, so a reader in a stack can take the space of the views beside it."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "geometry-proxy",
       "name": "The proxy, line 3",
       "text": "The closure's parameter, `proxy`, is a geometry proxy: a value that SwiftUI makes for the reader, which holds its size. `proxy.size` is the size that the reader chose, as a width and a height."
      }
     ],
     "marks": [
      {
       "line": 3,
       "text": "proxy",
       "part": "geometry-proxy",
       "label": "geometry proxy"
      },
      {
       "line": 6,
       "text": "proxy.size",
       "part": "geometry-proxy",
       "label": "its size"
      }
     ],
     "steps": [
      {
       "text": "Line 3 makes a geometry reader whose content is a blue `Color` with an `onAppear`, and stores it in `reader`. The closure has not run yet.",
       "line": 3,
       "also": [
        4
       ]
      },
      {
       "text": "Line 10 makes a renderer for `reader`, and line 11 proposes 300 by 200, the size on line 9.",
       "line": 10,
       "also": [
        9,
        11
       ]
      },
      {
       "text": "Line 12 asks for the image. The reader takes all of the proposal, and calls its closure with a proxy that holds 300 by 200.",
       "line": 12,
       "also": [
        3
       ]
      },
      {
       "text": "The color appears, and line 6 prints the size that the proxy holds: {{proposed (300.0, 200.0)}}.",
       "line": 6,
       "also": [
        5
       ],
       "prints": [
        "proposed (300.0, 200.0)"
       ]
      },
      {
       "text": "The image has the size that the reader chose, and line 13 prints {{300 200}}.",
       "line": 13,
       "prints": [
        "300 200"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The reader took the whole proposal, 300 by 200, and gave that size to its content through `proxy`."
     }
    }
   }
  },
  "grid-item": {
   "id": "grid-item",
   "name": "Grid item",
   "first": "The description of one column of a lazy grid, such as a flexible column that shares the grid's width with the other flexible columns.",
   "parts": []
  },
  "grid-row": {
   "id": "grid-row",
   "name": "Grid row",
   "first": "One row of a grid, whose first view goes in the grid's first column, its second view in the second column, and so on.",
   "parts": []
  },
  "grid": {
   "id": "grid",
   "name": "Grid",
   "area": "ui",
   "first": "A view that places its views in rows and columns, and makes each column as wide as the widest view in it.",
   "parts": [
    "grid-row"
   ],
   "dependsOn": [
    {
     "id": "stack-view",
     "views": [
      "what",
      "parts"
     ],
     "why": "A grid places views in rows and columns, as stacks place them in one row or one column, but lines up the columns across the rows.",
     "whyInExample": "Each `GridRow` holds its views in a row, as `HStack` does, and the grid lines up their columns."
    },
    {
     "id": "frame",
     "views": [
      "parts"
     ],
     "why": "The cells in the example have fixed frames, so that the widths are easy to add up.",
     "whyInExample": "Each cell is a color in a fixed frame, such as `frame(width: 80, height: 20)`, as the color in `frame(width: 80, height: 40)` is."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "let grid = Grid(",
     "    horizontalSpacing: 10, verticalSpacing: 10",
     ") {",
     "    GridRow {",
     "        Color.blue.frame(width: 80, height: 20)",
     "        Color.red.frame(width: 30, height: 20)",
     "    }",
     "    GridRow {",
     "        Color.green.frame(width: 50, height: 20)",
     "        Color.yellow.frame(width: 60, height: 20)",
     "    }",
     "}",
     "let renderer = ImageRenderer(content: grid)",
     "let image = renderer.cgImage!",
     "print(image.width, image.height)"
    ]
   },
   "views": {
    "what": {
     "is": "A grid is a view that places its views in rows and columns. Each `GridRow` is one row: its first view goes in the first column, and its second view in the second column. The grid makes each column as wide as the widest view in it, so the columns line up from row to row.",
     "marks": [
      {
       "line": 6,
       "text": "GridRow",
       "part": "grid-row",
       "label": "row 1"
      },
      {
       "line": 10,
       "text": "GridRow",
       "part": "grid-row",
       "label": "row 2"
      }
     ],
     "afterExample": "The first column holds views 80 and 50 points wide, so it is 80 wide. The second holds views 30 and 60 wide, so it is 60 wide. With 10 points between the columns and between the rows, the grid is 150 by 50.",
     "problem": "A table of labels and values, such as a trip's dates and prices, needs its columns to line up. Rows made of separate stacks size each row on its own, so their columns do not line up. A grid sizes each column across all of the rows.",
     "how": "Apple's documentation says that a grid handles rows and columns as one operation, and applies alignment and spacing to cells, rather than first to rows and then to columns. Each column is as wide as its widest cell, and each row as tall as its tallest cell.",
     "when": [
      {
       "text": "Use it for a small table whose columns should line up, such as labels beside their values."
      },
      {
       "text": "Don't use it for a long collection that scrolls. A grid makes all of its views at once. A lazy grid makes only the cells that are about to be shown."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "grid-row",
       "name": "The rows, lines 6 to 13",
       "text": "Each `GridRow` holds one row of the grid. Its first view goes in the grid's first column, and its second view in the second column. So the views of lines 7 and 11 are in the first column, and the views of lines 8 and 12 are in the second."
      }
     ],
     "marks": [
      {
       "line": 6,
       "text": "GridRow",
       "part": "grid-row",
       "label": "grid row"
      },
      {
       "line": 10,
       "text": "GridRow",
       "part": "grid-row",
       "label": "grid row"
      }
     ],
     "steps": [
      {
       "text": "Lines 3 to 5 make a grid with 10 points between the columns and between the rows. It has two rows, each with two colors in fixed frames.",
       "line": 3,
       "also": [
        4,
        6,
        10
       ]
      },
      {
       "text": "Line 15 makes a renderer, and line 16 asks for the image, so SwiftUI lays out the grid.",
       "line": 16,
       "also": [
        15
       ]
      },
      {
       "text": "The first column holds the views of lines 7 and 11, which are 80 and 50 points wide, so it is 80 wide. The second column holds the views of lines 8 and 12, 30 and 60 wide, so it is 60 wide.",
       "line": 7,
       "also": [
        11,
        8,
        12
       ]
      },
      {
       "text": "The grid is 80 plus 10 plus 60 points wide, and 20 plus 10 plus 20 points tall, so line 17 prints {{150 50}}.",
       "line": 17,
       "prints": [
        "150 50"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "Each column took the width of its widest view, from either row, so the columns line up."
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
  "image": {
   "id": "image",
   "name": "Image",
   "area": "ui",
   "first": "A view that shows a picture or a symbol, at the picture's own size unless it is made resizable.",
   "parts": [],
   "dependsOn": [
    {
     "id": "view",
     "views": [
      "what"
     ],
     "why": "An image is a view that SwiftUI provides."
    },
    {
     "id": "view-modifier",
     "views": [
      "what"
     ],
     "why": "An image is made to fit its space with modifiers."
    },
    {
     "id": "layout-process",
     "views": [
      "what"
     ],
     "why": "Whether an image takes the size it is proposed, or keeps its own, is the image's choice in the steps of layout."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "let star = Image(systemName: \"star\")",
     "let size = CGSize(width: 300, height: 200)",
     "",
     "let plain = ImageRenderer(content: star)",
     "plain.proposedSize = ProposedViewSize(size)",
     "let first = plain.cgImage!",
     "print(first.width, first.height)",
     "",
     "let resized = star.resizable()",
     "let grown = ImageRenderer(content: resized)",
     "grown.proposedSize = ProposedViewSize(size)",
     "let second = grown.cgImage!",
     "print(second.width, second.height)",
     "",
     "let fitted = resized.scaledToFit()",
     "let kept = ImageRenderer(content: fitted)",
     "kept.proposedSize = ProposedViewSize(size)",
     "let third = kept.cgImage!",
     "print(third.width, third.height)"
    ],
    "output": [
     "17 16",
     "300 200",
     "215 200"
    ]
   },
   "views": {
    "what": {
     "is": "An `Image` is a view that shows a picture, from the app's assets or from a file, or one of Apple's symbols. Unless it is made resizable, it keeps the picture's own size, whatever size it is proposed.",
     "marks": [
      {
       "line": 3,
       "text": "Image(systemName: \"star\")",
       "label": "a symbol"
      },
      {
       "line": 11,
       "text": "resizable()",
       "label": "takes the proposal"
      },
      {
       "line": 17,
       "text": "scaledToFit()",
       "label": "keeps its shape"
      }
     ],
     "afterExample": "Each renderer proposes 300 by 200 points. The plain star keeps its own size, 17 by 16. With `resizable()` it takes the whole proposal, 300 by 200, and stretches. With `scaledToFit()` as well, it grows as far as it can while it keeps its shape: 215 by 200.",
     "problem": "Pictures come in their own sizes, and screens do not. An image shows a picture at its own size, and two modifiers let it grow or shrink to the space it is given, without stretching it out of shape.",
     "how": "In the steps of layout, a plain `Image` chooses the picture's own size. The modifier `resizable()` makes it choose the size it is proposed. `scaledToFit()` then keeps the picture's shape, and chooses the largest size of that shape that fits the proposal.",
     "when": [
      {
       "text": "Use `resizable()` with `scaledToFit()` for a picture that should fill as much of its space as it can, and still keep its shape."
      },
      {
       "text": "Don't use `resizable()` alone on a picture that has a shape to keep: it stretches the picture to the proposal, as the star at 300 by 200."
      }
     ]
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
  "inactive-phase": {
   "id": "inactive-phase",
   "name": "Inactive phase",
   "first": "The phase of a scene that is in the foreground but should pause its work, such as while it is shown in the app switcher.",
   "parts": []
  },
  "key-path-expression": {
   "id": "key-path-expression",
   "name": "Key path expression",
   "first": "A backslash, a type's name, a dot, and a property's name, which make a key path to that property.",
   "parts": []
  },
  "key-path-subscript": {
   "id": "key-path-subscript",
   "name": "Key path subscript",
   "first": "The subscript that every type has, with the argument label keyPath, which reads or writes the property that a key path names.",
   "parts": []
  },
  "key-path": {
   "id": "key-path",
   "name": "Key path",
   "area": "swift",
   "first": "A value that names a property of a type, so that code can read or write that property of any instance later.",
   "parts": [
    "key-path-expression",
    "key-path-subscript"
   ],
   "dependsOn": [
    {
     "id": "structure",
     "views": [
      "what",
      "parts"
     ],
     "why": "A key path names a stored property of a type, such as a structure.",
     "whyInExample": "`\\Trip.nights` names the stored property `nights` of the structure `Trip`."
    },
    {
     "id": "generics",
     "views": [
      "parts"
     ],
     "why": "The type of a key path is generic: its type arguments are the type it starts from, and the type of the value it leads to.",
     "whyInExample": "The type of `path` gets two type arguments: `Trip`, the type it starts from, and `Int`, the type of `nights`."
    }
   ],
   "example": {
    "code": [
     "struct Trip {",
     "    var city: String",
     "    var nights: Int",
     "}",
     "",
     "let path = \\Trip.nights",
     "var trip = Trip(city: \"Lima\", nights: 3)",
     "print(trip[keyPath: path])",
     "trip[keyPath: path] = 5",
     "print(trip.nights)",
     "print(type(of: path))"
    ]
   },
   "views": {
    "what": {
     "is": "A key path is a value that names a property of a type, without an instance. It is written with a backslash, the type's name, a dot, and the property's name, as `\\Trip.nights`. Code can use it later to read or write that property of any instance of the type.",
     "marks": [
      {
       "line": 6,
       "text": "\\Trip.nights",
       "part": "key-path-expression",
       "label": "key path"
      }
     ],
     "afterExample": "`path` names the property `nights` of `Trip`. Line 8 reads that property from `trip` through `path`, and line 9 writes it.",
     "problem": "Some code works with a property that it is given, not one that it names itself, such as code that sorts trips by whichever property a person picks. A key path passes the property itself, as a value.",
     "how": "Swift's documentation says that swiftc replaces a key path expression with an instance of a key path class, whose type says what it starts from and what it leads to. The subscript written as `[keyPath: path]`, which every type has, reads or writes the property that the key path names.",
     "when": [
      {
       "text": "Use one where SwiftUI asks for a property by name, such as a value of the environment, or where code is given a property to sort or compare by."
      },
      {
       "text": "Don't use one where code can name the property directly, as `trip.nights` on line 10. That is shorter, and does the same."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "key-path-expression",
       "name": "The key path expression, line 6",
       "text": "A backslash, a type's name, a dot, and a property's name make a key path expression. `\\Trip.nights` names the property `nights` of `Trip`. It reads no value: no instance of `Trip` exists yet when line 6 runs."
      },
      {
       "part": "key-path-subscript",
       "name": "The key path subscript, lines 8 and 9",
       "text": "Every type has a subscript whose argument label is `keyPath`. Given a key path, it reads the property that the key path names, as on line 8, or writes it, as on line 9."
      }
     ],
     "marks": [
      {
       "line": 6,
       "text": "\\Trip.nights",
       "part": "key-path-expression",
       "label": "key path expression"
      },
      {
       "line": 8,
       "text": "[keyPath: path]",
       "part": "key-path-subscript",
       "label": "reads through it"
      },
      {
       "line": 9,
       "text": "[keyPath: path]",
       "part": "key-path-subscript",
       "label": "writes through it"
      }
     ],
     "steps": [
      {
       "text": "Line 6 makes a key path to the property `nights` of `Trip`, and stores it in `path`.",
       "line": 6,
       "also": [
        3
       ]
      },
      {
       "text": "Line 7 makes a `Trip` whose `nights` is 3, and stores it in `trip`.",
       "line": 7
      },
      {
       "text": "Line 8 reads `trip` through the key path in `path`, which reads its `nights`, and prints {{3}}.",
       "line": 8,
       "prints": [
        "3"
       ]
      },
      {
       "text": "Line 9 writes 5 through the same key path, which sets the `nights` of `trip` to 5.",
       "line": 9,
       "value": {
        "line": 9,
        "name": "trip.nights",
        "is": "5"
       }
      },
      {
       "text": "Line 10 reads `trip.nights` directly, and prints {{5}}.",
       "line": 10,
       "prints": [
        "5"
       ]
      },
      {
       "text": "Line 11 prints the type of `path`: {{WritableKeyPath<Trip, Int>}}. The key path starts from a `Trip`, leads to an `Int`, and can write, because `nights` is a `var`.",
       "line": 11,
       "prints": [
        "WritableKeyPath<Trip, Int>"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "`path` named the property `nights` before any `Trip` existed. Lines 8 and 9 used it to read and write that property of `trip`."
     }
    }
   }
  },
  "layout-process": {
   "id": "layout-process",
   "name": "Layout process",
   "area": "ui",
   "first": "How SwiftUI sizes every view, in three steps: the parent proposes a size, the child chooses its own size, and the parent places the child.",
   "parts": [
    "size-proposal"
   ],
   "dependsOn": [
    {
     "id": "view",
     "views": [
      "what",
      "parts"
     ],
     "why": "Layout sizes and places views.",
     "whyInExample": "A `Color` is a view that SwiftUI provides, and the renderers lay it out."
    },
    {
     "id": "view-modifier",
     "views": [
      "what",
      "parts"
     ],
     "why": "A modifier can change the size that a view chooses.",
     "whyInExample": "`aspectRatio(1, contentMode: .fit)` is a modifier that returns a new view around the color, which chooses a square."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "let size = CGSize(width: 300, height: 200)",
     "",
     "let filler = ImageRenderer(content: Color.blue)",
     "filler.proposedSize = ProposedViewSize(size)",
     "let first = filler.cgImage!",
     "print(first.width, first.height)",
     "",
     "let square = Color.blue",
     "    .aspectRatio(1, contentMode: .fit)",
     "let fitter = ImageRenderer(content: square)",
     "fitter.proposedSize = ProposedViewSize(size)",
     "let second = fitter.cgImage!",
     "print(second.width, second.height)"
    ]
   },
   "views": {
    "what": {
     "is": "Layout is how SwiftUI decides the size and the place of every view, in three steps. The parent proposes a size to the child. The child chooses its own size, which can differ from the proposal. Then the parent places the child in its own space.",
     "marks": [
      {
       "line": 6,
       "text": "ProposedViewSize(size)",
       "part": "size-proposal",
       "label": "a proposal"
      }
     ],
     "afterExample": "Both views get the same proposal, 300 by 200 points. The color chooses all of it. The color with an aspect ratio of 1 chooses the largest square that fits, 200 by 200.",
     "problem": "Views must fit screens of many sizes, held either way, with words of many lengths. Fixed sizes and positions for every view break when the screen changes. In SwiftUI, each parent proposes a size and each child chooses its own, so the same views fit any space.",
     "how": "Apple's documentation says that views choose their own size, in response to a size proposal from their parent. Each kind of view has its own rule: a color chooses the whole proposal, and the modifier `aspectRatio(1, contentMode: .fit)` chooses the largest square that fits it. The parent then places the child in its own space.",
     "when": [
      {
       "text": "Use the three steps to explain a size you did not expect: find what the parent proposed, and then what the child chose."
      },
      {
       "text": "Don't expect a view to fill the space it is offered. Each view chooses its own size, and many choose less than the proposal."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "size-proposal",
       "name": "The proposal, lines 3 and 6",
       "text": "A proposal is the size that a parent offers a child, as a width and a height. Line 3 makes `size`, 300 points across and 200 points down, and `ProposedViewSize(size)` makes it a proposal. Here each renderer is the parent: lines 6 and 13 give it this proposal for the view it draws."
      }
     ],
     "marks": [
      {
       "line": 3,
       "text": "CGSize(width: 300, height: 200)",
       "part": "size-proposal",
       "label": "300 by 200"
      },
      {
       "line": 6,
       "text": "ProposedViewSize(size)",
       "part": "size-proposal",
       "label": "proposal"
      },
      {
       "line": 13,
       "text": "ProposedViewSize(size)",
       "part": "size-proposal",
       "label": "proposal"
      }
     ],
     "steps": [
      {
       "text": "Line 5 makes a renderer for a blue `Color`, and line 6 gives it the proposal of 300 by 200 from line 3.",
       "line": 6,
       "also": [
        5,
        3
       ]
      },
      {
       "text": "Line 7 asks for the image. The renderer proposes 300 by 200, and the color chooses all of it, so line 8 prints {{300 200}}.",
       "line": 8,
       "also": [
        7
       ],
       "prints": [
        "300 200"
       ]
      },
      {
       "text": "Lines 10 and 11 make a blue `Color` with the modifier `aspectRatio(1, contentMode: .fit)`. Line 12 makes a renderer for it, and line 13 gives it the same proposal.",
       "line": 12,
       "also": [
        10,
        11,
        13
       ]
      },
      {
       "text": "Line 14 asks for the image. The view with the modifier chooses the largest square that fits in 300 by 200, which is 200 by 200, and line 15 prints {{200 200}}.",
       "line": 15,
       "also": [
        14
       ],
       "prints": [
        "200 200"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "Both views got the same proposal, and each chose its own size: the color took all of it, and the square took what fit its shape."
     }
    }
   }
  },
  "lazy-grid": {
   "id": "lazy-grid",
   "name": "Lazy grid",
   "area": "ui",
   "first": "A grid that grows in one direction inside a scroll view, and makes each cell only when the cell is about to be shown.",
   "parts": [
    "grid-item"
   ],
   "dependsOn": [
    {
     "id": "grid",
     "views": [
      "what",
      "parts"
     ],
     "why": "A lazy grid places views in rows and columns, as a grid does, but sets its columns from their descriptions, not from its cells.",
     "whyInExample": "`LazyVGrid` places its cells in two columns, as `Grid` places its views in columns."
    },
    {
     "id": "lazy-stack",
     "views": [
      "what",
      "parts"
     ],
     "why": "A lazy grid makes its cells only when they are about to be shown, as a lazy stack makes its rows.",
     "whyInExample": "Only the cells that fit add their `number` to `made`, as only the rows that fit add theirs in the example of Lazy stack."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "var made: [Int] = []",
     "",
     "struct Cell: View {",
     "    let number: Int",
     "    var body: some View {",
     "        Color.blue",
     "            .aspectRatio(1, contentMode: .fit)",
     "            .onAppear { made.append(number) }",
     "    }",
     "}",
     "",
     "let column = GridItem(.flexible(), spacing: 0)",
     "let columns = [column, column]",
     "let grid = ScrollView {",
     "    LazyVGrid(columns: columns, spacing: 0) {",
     "        Cell(number: 1)",
     "        Cell(number: 2)",
     "        Cell(number: 3)",
     "        Cell(number: 4)",
     "        Cell(number: 5)",
     "        Cell(number: 6)",
     "    }",
     "}",
     "let size = CGSize(width: 100, height: 100)",
     "let renderer = ImageRenderer(content: grid)",
     "renderer.proposedSize = ProposedViewSize(size)",
     "let image = renderer.cgImage!",
     "print(image.width, image.height)",
     "print(made.sorted())"
    ]
   },
   "views": {
    "what": {
     "is": "A lazy grid places its views in a set number of columns, filling each row from leading to trailing before the next one, and grows down as far as its views need. Apple's documentation says that it creates items only as needed: it makes a cell only when the cell is about to be shown.",
     "marks": [
      {
       "line": 14,
       "text": "GridItem(.flexible(), spacing: 0)",
       "part": "grid-item",
       "label": "a column"
      },
      {
       "line": 17,
       "text": "LazyVGrid",
       "label": "lazy grid"
      }
     ],
     "afterExample": "Two flexible columns share 100 points, so each cell is 50 by 50. Two rows fit in the 100 points that are shown, and the grid made only their four cells.",
     "problem": "A long collection shown in columns, such as a photo of every trip, would make every cell at once in a plain grid. A lazy grid makes the cells on the screen, and makes more as the user scrolls, as a lazy stack does for rows.",
     "how": "The array of grid items says how many columns there are, and how wide each one is: a flexible column shares the width with the other flexible columns. The grid places its views into those columns, row by row, and makes only the rows that are about to be shown.",
     "when": [
      {
       "text": "Use it inside a scroll view for a long collection shown in columns, such as photos."
      },
      {
       "text": "Don't use it when each column must be as wide as its widest cell. A lazy grid sets the width of its columns from its grid items, while a grid sets it from its cells."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "grid-item",
       "name": "The columns, lines 14 and 15",
       "text": "Line 14 describes one flexible column with no space after it, and line 15 makes `columns`, an array of two of them. A flexible column shares the grid's width with the other flexible columns, so in 100 points each column is 50 points wide."
      }
     ],
     "marks": [
      {
       "line": 14,
       "text": "GridItem(.flexible(), spacing: 0)",
       "part": "grid-item",
       "label": "grid item"
      },
      {
       "line": 15,
       "text": "[column, column]",
       "part": "grid-item",
       "label": "two columns"
      }
     ],
     "steps": [
      {
       "text": "Line 3 makes an empty array, `made`, which will hold the number of each cell that is made.",
       "line": 3
      },
      {
       "text": "Lines 5 to 12 declare `Cell`, a view: a blue square that adds its `number` to `made` in the closure of `onAppear`.",
       "line": 5,
       "also": [
        10
       ]
      },
      {
       "text": "Lines 14 and 15 describe two flexible columns, and store them in `columns`.",
       "line": 14,
       "also": [
        15
       ]
      },
      {
       "text": "Line 16 makes a scroll view whose content is a lazy grid of six cells, numbered 1 to 6.",
       "line": 16,
       "also": [
        17,
        18
       ]
      },
      {
       "text": "Line 27 makes a renderer, and line 28 proposes 100 by 100, the size on line 26.",
       "line": 27,
       "also": [
        26,
        28
       ]
      },
      {
       "text": "Line 29 asks for the image, and line 30 prints the size of the scroll view: {{100 100}}.",
       "line": 30,
       "also": [
        29
       ],
       "prints": [
        "100 100"
       ]
      },
      {
       "text": "Each cell is 50 by 50, two to a row, so rows 1 and 2, with cells 1 to 4, fill the 100 points that are shown. The lazy grid made only those, and line 31 prints {{[1, 2, 3, 4]}}.",
       "line": 31,
       "prints": [
        "[1, 2, 3, 4]"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The lazy grid made only the four cells that were about to be shown, and would make cells 5 and 6 when the user scrolled to them."
     }
    }
   }
  },
  "lazy-stack": {
   "id": "lazy-stack",
   "name": "Lazy stack",
   "area": "ui",
   "first": "A stack that makes each of its views only when the view is about to be shown, so that a long list makes only the views on the screen.",
   "parts": [
    "stack-content"
   ],
   "dependsOn": [
    {
     "id": "stack-view",
     "views": [
      "what",
      "parts"
     ],
     "why": "A lazy stack places its views as a stack does, and differs only in when it makes them.",
     "whyInExample": "`LazyVStack` places its rows in a column, as `HStack` places its views in a row."
    },
    {
     "id": "scroll-view",
     "views": [
      "what",
      "parts"
     ],
     "why": "A lazy stack is used inside a scroll view, which shows only part of it at a time.",
     "whyInExample": "The example is the scroll view of the page of Scroll view, with `LazyVStack` in place of `VStack`."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "var made: [Int] = []",
     "",
     "struct Row: View {",
     "    let number: Int",
     "    var body: some View {",
     "        Color.blue",
     "            .aspectRatio(2, contentMode: .fit)",
     "            .onAppear { made.append(number) }",
     "    }",
     "}",
     "",
     "let list = ScrollView {",
     "    LazyVStack(spacing: 0) {",
     "        Row(number: 1)",
     "        Row(number: 2)",
     "        Row(number: 3)",
     "        Row(number: 4)",
     "    }",
     "}",
     "let size = CGSize(width: 100, height: 100)",
     "let renderer = ImageRenderer(content: list)",
     "renderer.proposedSize = ProposedViewSize(size)",
     "let image = renderer.cgImage!",
     "print(image.width, image.height)",
     "print(made.sorted())"
    ]
   },
   "views": {
    "what": {
     "is": "A lazy stack places its views in a column or a row, as a stack does, but makes each view only when it is about to be shown. Apple's documentation says that the stack does not create items until it needs to render them on the screen.",
     "marks": [
      {
       "line": 15,
       "text": "LazyVStack",
       "label": "lazy stack"
      }
     ],
     "afterExample": "This is the scroll view of the page of Scroll view, with `LazyVStack` in place of its plain stack. Only rows 1 and 2 fit in 100 points, and only they were made.",
     "problem": "A list of a thousand trips in a plain stack makes a thousand views at once, though a screen shows only a few. A lazy stack makes the ones on the screen, and makes more as the user scrolls.",
     "how": "Inside a scroll view, a lazy stack finds which of its views fall inside the part that is shown, and makes only those. When the user scrolls, it makes the views that come into view.",
     "when": [
      {
       "text": "Use it inside a scroll view for a long list of views, such as one row for each trip."
      },
      {
       "text": "Don't use it for a few views that always fit on the screen. A plain stack is simpler, and making a few views costs little."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "stack-content",
       "name": "The rows, lines 16 to 19",
       "text": "The braces after `LazyVStack` hold four rows. The lazy stack makes a row only when it is about to be shown, so a row's `onAppear` runs only then."
      }
     ],
     "marks": [
      {
       "line": 16,
       "text": "Row(number: 1)",
       "part": "stack-content",
       "label": "row 1"
      },
      {
       "line": 17,
       "text": "Row(number: 2)",
       "part": "stack-content",
       "label": "row 2"
      },
      {
       "line": 18,
       "text": "Row(number: 3)",
       "part": "stack-content",
       "label": "row 3"
      },
      {
       "line": 19,
       "text": "Row(number: 4)",
       "part": "stack-content",
       "label": "row 4"
      }
     ],
     "steps": [
      {
       "text": "Line 3 makes an empty array, `made`, which will hold the number of each row that is made.",
       "line": 3
      },
      {
       "text": "Lines 5 to 12 declare `Row`, a view: a blue color twice as wide as it is tall, which adds its `number` to `made` in the closure of `onAppear`.",
       "line": 5,
       "also": [
        10
       ]
      },
      {
       "text": "Line 14 makes a scroll view whose content is a lazy stack of four rows, numbered 1 to 4.",
       "line": 14,
       "also": [
        15,
        16
       ]
      },
      {
       "text": "Line 23 makes a renderer for the scroll view, and line 24 proposes 100 by 100, the size on line 22.",
       "line": 23,
       "also": [
        22,
        24
       ]
      },
      {
       "text": "Line 25 asks for the image, and line 26 prints the size of the scroll view: {{100 100}}.",
       "line": 26,
       "also": [
        25
       ],
       "prints": [
        "100 100"
       ]
      },
      {
       "text": "Rows 1 and 2, 50 points tall each, fill the 100 points that are shown. The lazy stack made only those two, so line 27 prints {{[1, 2]}}.",
       "line": 27,
       "prints": [
        "[1, 2]"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The lazy stack made only the rows that were about to be shown. Rows 3 and 4 would be made when the user scrolled to them."
     }
    }
   }
  },
  "local-value": {
   "id": "local-value",
   "name": "Local constant or variable",
   "first": "A constant or variable declared inside a function's body.",
   "parts": []
  },
  "macro": {
   "id": "macro",
   "name": "Macro",
   "area": "swift",
   "first": "Code that swiftc runs while it builds a program, which adds Swift code to the program where the macro is used.",
   "parts": [
    "freestanding-macro",
    "attached-macro"
   ],
   "dependsOn": [
    {
     "id": "function",
     "views": [
      "what",
      "parts"
     ],
     "why": "The macro in the example is used inside a function, and expands to the function's name.",
     "whyInExample": "`#function` is written inside the function `pack(_:)`, and expands to its name."
    }
   ],
   "example": {
    "code": [
     "func pack(_ item: String) {",
     "    print(\"\\(#function) packs \\(item)\")",
     "}",
     "",
     "pack(\"Socks\")",
     "pack(\"Map\")"
    ],
    "sil": [
     {
      "in": "pack(_:)",
      "has": "string_literal utf8 \"pack(_:)\"",
      "shows": "swiftc replaced #function with the text pack(_:) when it built the program."
     }
    ]
   },
   "snippets": {
    "attached": {
     "code": [
      "import Observation",
      "@Observable",
      "final class Basket {",
      "    var apples = 0",
      "}",
      "let basket = Basket()",
      "basket.apples = 3",
      "print(basket.apples)  // 3"
     ],
     "output": [
      "3"
     ]
    }
   },
   "views": {
    "what": {
     "is": "A macro is code that swiftc runs while it builds the program, and that adds Swift code where the macro is used. A freestanding macro is written with a number sign, as `#function`, and is replaced by the code it expands to. An attached macro is written with an at sign before a declaration, and adds code to that declaration.",
     "marks": [
      {
       "line": 2,
       "text": "#function",
       "part": "freestanding-macro",
       "label": "macro"
      }
     ],
     "afterExample": "`#function` is a macro from the Swift standard library. swiftc replaced it with the name of the function it is in, so each call prints {{pack(_:)}} first.",
     "problem": "Some code follows the same pattern every time, such as code that writes a function's name, or code that tells SwiftUI when a property changes. Written by hand, it is repeated, and can fall out of date. A macro writes it when the program is built, from the code around it.",
     "how": "When swiftc builds the program, it expands each macro: it runs the macro's own code, and puts the code that the macro writes into the program. Swift's documentation says that a macro only adds code, and never deletes or changes the code you wrote. swiftc then checks the added code, as it checks yours.",
     "when": [
      {
       "text": "Use the macros that Swift and SwiftUI provide where they save writing the same code by hand. `@Observable` is an attached macro: it adds code to the class it is written before, so that SwiftUI can tell when its properties change:",
       "snippet": "attached"
      },
      {
       "text": "Don't expect to find the added code in your file: swiftc adds it while it builds the program. In Xcode, Expand Macro in the Editor menu shows the code that a macro adds."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "freestanding-macro",
       "name": "The macro `#function`, line 2",
       "text": "A number sign before a name uses a freestanding macro. `#function` is a freestanding macro from the Swift standard library. swiftc expands it to a string that holds the name of the function it is in, `pack(_:)`."
      }
     ],
     "marks": [
      {
       "line": 2,
       "text": "#function",
       "part": "freestanding-macro",
       "label": "freestanding macro"
      }
     ],
     "steps": [
      {
       "text": "Line 5 calls `pack(_:)` with `\"Socks\"`.",
       "line": 5,
       "also": [
        1
       ]
      },
      {
       "text": "swiftc expanded `#function` on line 2 to the name of the function it is in, so line 2 prints {{pack(_:) packs Socks}}.",
       "line": 2,
       "prints": [
        "pack(_:) packs Socks"
       ]
      },
      {
       "text": "Line 6 calls `pack(_:)` again, and line 2 prints {{pack(_:) packs Map}}.",
       "line": 2,
       "also": [
        6
       ],
       "prints": [
        "pack(_:) packs Map"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "`#function` was replaced by the name of the function it is in when swiftc built the program, not while the program ran."
     }
    }
   }
  },
  "main-attribute": {
   "id": "main-attribute",
   "name": "Main attribute",
   "first": "The attribute, written with an at sign before a type, that marks the type that the program starts from, by calling the type's static main method.",
   "parts": []
  },
  "memberwise-initializer": {
   "id": "memberwise-initializer",
   "name": "Memberwise initializer",
   "first": "An initializer that swiftc writes for a structure that declares none of its own, with a parameter for its stored properties, each labeled with the property's name.",
   "parts": []
  },
  "modifier-body": {
   "id": "modifier-body",
   "name": "Modifier body",
   "first": "The method of a custom modifier that gets the view it is applied to, as its content, and returns the new view.",
   "parts": []
  },
  "modifier-call": {
   "id": "modifier-call",
   "name": "Modifier call",
   "first": "A call of a view modifier on a view, written after a dot, which returns a new view and leaves the first one as it was.",
   "parts": []
  },
  "opaque-type": {
   "id": "opaque-type",
   "name": "Opaque type",
   "area": "swift",
   "first": "A return type that names only a protocol, while swiftc still knows the one real type that the function returns.",
   "parts": [
    "some-keyword",
    "underlying-type"
   ],
   "dependsOn": [
    {
     "id": "protocol",
     "views": [
      "what",
      "parts"
     ],
     "why": "An opaque type names a protocol, and the code that gets the value can use only what the protocol requires.",
     "whyInExample": "`some Shape` names the protocol `Shape`, so the code that calls `makeTile()` can call only `area()`, which `Shape` requires."
    }
   ],
   "example": {
    "code": [
     "protocol Shape {",
     "    func area() -> Int",
     "}",
     "struct Square: Shape {",
     "    let side: Int",
     "    func area() -> Int {",
     "        return side * side",
     "    }",
     "}",
     "func makeTile() -> some Shape {",
     "    return Square(side: 3)",
     "}",
     "let tile = makeTile()",
     "print(tile.area())",
     "print(type(of: tile))"
    ]
   },
   "snippets": {
    "body": {
     "code": [
      "import SwiftUI",
      "struct Greeting: View {",
      "    var body: some View {",
      "        Text(\"Hello\")",
      "    }",
      "}",
      "print(type(of: Greeting().body))  // Text"
     ],
     "output": [
      "Text"
     ]
    }
   },
   "views": {
    "what": {
     "is": "An opaque type is a return type written as `some` followed by a protocol's name. The function returns a value of one real type, which swiftc knows when it builds the program. The code that calls the function knows only that the value conforms to the protocol.",
     "marks": [
      {
       "line": 10,
       "text": "some",
       "part": "some-keyword",
       "label": "opaque type"
      },
      {
       "line": 11,
       "text": "Square(side: 3)",
       "part": "underlying-type",
       "label": "the real type"
      }
     ],
     "afterExample": "`makeTile()` returns a `Square`, but its return type says only `some Shape`. Line 14 can call `area()`, which every `Shape` has, and line 15 shows that the value is still a `Square`.",
     "problem": "A function sometimes returns a value whose real type is long, private, or likely to change, while its callers need only what one protocol offers. With an opaque type, the function's declaration names the protocol, and the real type can change without a change to the code that calls the function.",
     "how": "swiftc works out the real type from the function's return statement when it builds the program, and checks that it conforms to the protocol. Every call returns that one type. The code that calls the function can use only what the protocol requires.",
     "when": [
      {
       "text": "Use one where SwiftUI asks for it. Every view's `body` has the type `some View`, and swiftc knows that this one is a `Text`:",
       "snippet": "body"
      },
      {
       "text": "Don't use one when a function must return values of different types on different calls, such as a square on one call and a circle on the next. An opaque type is one real type, so that function does not build. A boxed protocol type, written with the keyword any, can hold a value of any conforming type."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "some-keyword",
       "name": "The keyword `some`, line 10",
       "text": "The keyword `some`, before the protocol's name `Shape`, makes the return type of `makeTile()` an opaque type. It says that the function returns a value of one type that conforms to `Shape`, without saying which type."
      },
      {
       "part": "underlying-type",
       "name": "The real type, `Square`",
       "text": "The value that line 11 returns is a `Square`, so `Square` is the real type behind `some Shape`. Swift's documentation calls it the underlying type. swiftc knows it, and checks that it conforms to `Shape`. The code on lines 13 to 15 knows only that `tile` is a `Shape`."
      }
     ],
     "marks": [
      {
       "line": 10,
       "text": "some",
       "part": "some-keyword",
       "label": "keyword"
      },
      {
       "line": 11,
       "text": "Square(side: 3)",
       "part": "underlying-type",
       "label": "underlying type"
      }
     ],
     "steps": [
      {
       "text": "Line 13 calls `makeTile()`.",
       "line": 13,
       "also": [
        10
       ]
      },
      {
       "text": "Line 11 makes a `Square` whose `side` is 3, and returns it. `tile` holds that `Square`, though the function's return type says only `some Shape`.",
       "line": 11,
       "also": [
        13
       ]
      },
      {
       "text": "Line 14 calls `area()`, which `Shape` requires, so code can call it on any `Shape`. Line 7 returns 3 times 3, and line 14 prints {{9}}.",
       "line": 14,
       "also": [
        7
       ],
       "prints": [
        "9"
       ]
      },
      {
       "text": "Line 15 prints the type of the value in `tile` while the program runs: {{Square}}. The opaque type hid the type from the code that called `makeTile()`, but did not change it.",
       "line": 15,
       "prints": [
        "Square"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "`makeTile()` returns one real type, `Square`. The code that calls it uses the value only through `Shape`."
     }
    }
   }
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
  "place-subviews": {
   "id": "place-subviews",
   "name": "Placing method",
   "first": "The method of a layout that places each view inside it at a point, with a proposal for that view's size.",
   "parts": []
  },
  "preview": {
   "id": "preview",
   "name": "Preview",
   "area": "ui",
   "first": "A macro that tells Xcode which view to show in its canvas, beside the code, so the view can be seen while its code is written.",
   "parts": [],
   "dependsOn": [
    {
     "id": "view",
     "views": [
      "what"
     ],
     "why": "A preview shows a view."
    },
    {
     "id": "macro",
     "views": [
      "what"
     ],
     "why": "A preview is written with a freestanding macro, which adds code that Xcode's canvas calls."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Greeting: View {",
     "    let name: String",
     "    var body: some View {",
     "        Text(\"Hello, \\(name)\")",
     "    }",
     "}",
     "",
     "#Preview {",
     "    Greeting(name: \"Ana\")",
     "}"
    ],
    "sil": [
     {
      "in": "static $s7Example0015mainswift_tzEGbfMX9_0_33_B384B672EB89465DCC67528E23350CF9Ll7PreviewfMf_15PreviewRegistryfMu_.makePreview()",
      "has": "function_ref Preview.init(_:traits:body:)",
      "shows": "The macro added a type whose method makePreview() makes a Preview from the code between the braces."
     }
    ]
   },
   "views": {
    "what": {
     "is": "A preview is the macro `#Preview` followed by braces that make a view. Xcode shows that view in its canvas, next to the code, and draws it again as the code changes, without running the app.",
     "marks": [
      {
       "line": 10,
       "text": "#Preview",
       "label": "preview"
      }
     ],
     "afterExample": "The braces after `#Preview` make a `Greeting` with the name `\"Ana\"`. Xcode's canvas shows it, and a change to `Greeting` shows in the canvas as soon as Xcode builds the code again.",
     "problem": "Seeing a view by running the app takes time, and reaching a screen deep inside the app takes more. A preview shows one view, with the values that the preview gives it, right beside its code.",
     "how": "`#Preview` is a freestanding macro. When swiftc builds the program, the macro adds a type with a method that makes a preview from the code between the braces, and Xcode's canvas calls it. Nothing in the app calls it.",
     "when": [
      {
       "text": "Use one for each view, with the values that show its different states, such as a long name and a short one. A file can have several, and the canvas lets you choose which one it shows."
      },
      {
       "text": "Don't rely on a preview for behavior that needs the whole app, such as data that another screen loads. A preview shows one view, with only what its braces give it."
      }
     ]
    }
   }
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
  "result-builder-attribute": {
   "id": "result-builder-attribute",
   "name": "Result builder attribute",
   "first": "The attribute, written with an at sign before the declaration of a type, that makes the type a result builder.",
   "parts": []
  },
  "result-builder": {
   "id": "result-builder",
   "name": "Result builder",
   "area": "swift",
   "first": "A type whose static methods swiftc calls to combine the lines of a body of code into one value, so that the body lists its parts with no return.",
   "parts": [
    "result-builder-attribute",
    "build-block",
    "builder-attribute"
   ],
   "dependsOn": [
    {
     "id": "function",
     "views": [
      "what",
      "parts"
     ],
     "why": "A result builder changes how swiftc builds the body of a function, and its methods are functions.",
     "whyInExample": "`@ListBuilder` changes how swiftc builds the body of the function `packing()`."
    },
    {
     "id": "structure",
     "views": [
      "parts"
     ],
     "why": "The result builder in the example is a structure.",
     "whyInExample": "`ListBuilder` is declared with `struct`, as `Trip` is."
    }
   ],
   "example": {
    "code": [
     "@resultBuilder",
     "struct ListBuilder {",
     "    static func buildBlock(",
     "        _ items: String...",
     "    ) -> [String] {",
     "        return items",
     "    }",
     "}",
     "",
     "@ListBuilder",
     "func packing() -> [String] {",
     "    \"Socks\"",
     "    \"Map\"",
     "    \"Tickets\"",
     "}",
     "",
     "print(packing())"
    ],
    "sil": [
     {
      "in": "packing()",
      "has": "function_ref static ListBuilder.buildBlock(_:)",
      "shows": "swiftc built the body of packing() as a call of buildBlock."
     }
    ]
   },
   "views": {
    "what": {
     "is": "A result builder is a type marked `@resultBuilder`, whose static methods combine several values into one. Writing the builder's name as an attribute before a function, as `@ListBuilder`, lets the function's body list values one per line, with no `return`. swiftc turns those lines into a call of the builder's `buildBlock`.",
     "marks": [
      {
       "line": 1,
       "text": "@resultBuilder",
       "part": "result-builder-attribute",
       "label": "result builder"
      },
      {
       "line": 10,
       "text": "@ListBuilder",
       "part": "builder-attribute",
       "label": "built with ListBuilder"
      }
     ],
     "afterExample": "The body of `packing()` lists three strings and has no `return`. `ListBuilder` combines them into one array, which line 17 prints.",
     "problem": "Some values are built from many parts, such as a list of things to pack, or the views of a screen. Written as one call, they need commas, brackets, and a `return`. A result builder lets the code list the parts one per line, and builds the value from them.",
     "how": "When swiftc builds the program, it changes the body of `packing()`: it collects the value of each line, and passes them all to the `buildBlock` of `ListBuilder`, whose result the function returns. A builder can have more static methods, such as one for if statements, and swiftc calls each one where the body needs it.",
     "when": [
      {
       "text": "Use one where a value is a list of parts that read more clearly one per line than as one call. SwiftUI builds the body of every view with its own result builder, the view builder."
      },
      {
       "text": "Don't write one for a list that ordinary code makes as clearly, such as an array literal in brackets: the builder is one more type to read."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "result-builder-attribute",
       "name": "The attribute `@resultBuilder`, line 1",
       "text": "The attribute `@resultBuilder` makes `ListBuilder` a result builder. Its name can then be written as an attribute, and swiftc calls its methods. They are marked `static`: a static method belongs to the type itself, so swiftc calls it without making an instance of `ListBuilder`."
      },
      {
       "part": "build-block",
       "name": "The method `buildBlock`, lines 3 to 7",
       "text": "The static method `buildBlock` combines the values of a block, such as the body of `packing()`. Its parameter `items`, on line 4, has the type `String...`: the three dots let a call pass any number of strings, which the method gets as an array. It returns that array."
      },
      {
       "part": "builder-attribute",
       "name": "The attribute `@ListBuilder`, line 10",
       "text": "Writing a result builder's name as an attribute before a function makes swiftc build the function's body with that builder. Each line of the body, such as `\"Socks\"`, is a value for the builder, and the body needs no `return`."
      }
     ],
     "marks": [
      {
       "line": 1,
       "text": "@resultBuilder",
       "part": "result-builder-attribute",
       "label": "attribute"
      },
      {
       "line": 3,
       "text": "buildBlock",
       "part": "build-block",
       "label": "build block method"
      },
      {
       "line": 10,
       "text": "@ListBuilder",
       "part": "builder-attribute",
       "label": "builder attribute"
      },
      {
       "line": 12,
       "text": "\"Socks\"",
       "part": "builder-attribute",
       "label": "a value for the builder"
      }
     ],
     "steps": [
      {
       "text": "Line 17 calls `packing()`.",
       "line": 17,
       "also": [
        11
       ]
      },
      {
       "text": "swiftc built the body of `packing()` with `ListBuilder`, so the three strings on lines 12 to 14 are not separate statements. They are the arguments of one call of `buildBlock`.",
       "line": 12,
       "also": [
        13,
        14,
        3
       ]
      },
      {
       "text": "`buildBlock` gets the three strings as the array `items`, and line 6 returns it. `packing()` returns that array.",
       "line": 6,
       "value": {
        "line": 6,
        "name": "items",
        "is": "[\"Socks\", \"Map\", \"Tickets\"]"
       }
      },
      {
       "text": "Line 17 prints the array: {{[\"Socks\", \"Map\", \"Tickets\"]}}.",
       "line": 17,
       "prints": [
        "[\"Socks\", \"Map\", \"Tickets\"]"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "swiftc turned the body of `packing()` into one call of `buildBlock`, which combined its three lines into one array."
     }
    }
   }
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
  "scene-body": {
   "id": "scene-body",
   "name": "Scene body",
   "first": "The computed property of an app or of a scene, whose value is the scenes that it is made of.",
   "parts": []
  },
  "scene-phase": {
   "id": "scene-phase",
   "name": "Scene phase",
   "area": "ui",
   "first": "Whether a scene is active, inactive, or in the background, which a view reads from the environment to save or pause its work.",
   "parts": [
    "active-phase",
    "inactive-phase",
    "background-phase"
   ],
   "dependsOn": [
    {
     "id": "scene",
     "views": [
      "what",
      "parts"
     ],
     "why": "A phase belongs to a scene, and the system moves each scene through its phases.",
     "whyInExample": "In an app, `Saver` would be inside a scene, such as a `WindowGroup`, and would read that scene's phase."
    },
    {
     "id": "environment",
     "views": [
      "what",
      "parts"
     ],
     "why": "A view reads its scene's phase from the environment.",
     "whyInExample": "`@Environment(\\.scenePhase)` reads the phase, as `@Environment(\\.isEnabled)` reads whether views are enabled."
    },
    {
     "id": "closure",
     "views": [
      "parts"
     ],
     "why": "The code that runs when the phase changes is a closure, which SwiftUI calls with the old and the new phase.",
     "whyInExample": "The braces after `onChange(of: phase)` hold a closure with two parameters, `old` and `new`."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Saver: View {",
     "    @Environment(\\.scenePhase) private var phase",
     "    var body: some View {",
     "        let _ = print(\"phase is\", phase)",
     "        Text(\"Saver\")",
     "            .onChange(of: phase) { old, new in",
     "                print(\"from\", old, \"to\", new)",
     "            }",
     "    }",
     "}",
     "",
     "let active = Saver()",
     "    .environment(\\.scenePhase, .active)",
     "let renderer = ImageRenderer(content: active)",
     "_ = renderer.cgImage",
     "renderer.content = Saver()",
     "    .environment(\\.scenePhase, .background)",
     "_ = renderer.cgImage"
    ]
   },
   "views": {
    "what": {
     "is": "A scene's phase says whether the scene is active, inactive, or in the background. The system sets it in the environment of each view in the scene, so a view reads it with `@Environment(\\.scenePhase)`, and can run code when it changes.",
     "marks": [
      {
       "line": 4,
       "text": "@Environment(\\.scenePhase) private var phase",
       "label": "reads the phase"
      },
      {
       "line": 15,
       "text": ".active",
       "part": "active-phase",
       "label": "active"
      },
      {
       "line": 19,
       "text": ".background",
       "part": "background-phase",
       "label": "in the background"
      }
     ],
     "afterExample": "`Saver` reads the phase, and prints each change. In an app, the system sets the phase. Here lines 15 and 19 set it, with `environment`, so that the program can show what happens.",
     "problem": "An app should save its work when a person leaves it, and pause work that no one can see. In UIKit, the app delegate heard about this. In SwiftUI, each view can read its scene's phase, and run code when it changes.",
     "how": "The system moves each scene through its phases, and sets the phase in the environment of the scene's views. Apple's documentation says that a view reads the phase of the scene it is in, while an app reads one phase for all its scenes, which is active when any scene is active. The modifier `onChange(of:)` calls its closure each time the value it watches changes.",
     "when": [
      {
       "text": "Use it to save data when the phase becomes background. Apple's documentation says to expect an app in the background to be ended, so the work must be done right away."
      },
      {
       "text": "Don't treat inactive as the background. Apple's documentation says that an inactive scene is still in the foreground, such as one shown in the app switcher, and should only pause its work."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "active-phase",
       "name": "The phase `.active`, line 15",
       "text": "The phase `.active` means the scene is in the foreground, and a person can use it. Line 15 sets it, as the system does for a scene on the screen."
      },
      {
       "part": "background-phase",
       "name": "The phase `.background`, line 19",
       "text": "The phase `.background` means the scene is not visible. Line 19 sets it, as the system does when a person leaves the app."
      }
     ],
     "marks": [
      {
       "line": 15,
       "text": ".active",
       "part": "active-phase",
       "label": "active"
      },
      {
       "line": 19,
       "text": ".background",
       "part": "background-phase",
       "label": "background"
      }
     ],
     "steps": [
      {
       "text": "Line 14 makes a `Saver`, and line 15 sets the phase in its environment to `.active`. Line 16 makes a renderer for it, and line 17 asks for the image, so SwiftUI draws it.",
       "line": 15,
       "also": [
        14,
        16,
        17
       ]
      },
      {
       "text": "The `body` of `Saver` runs, and line 6 prints {{phase is active}}.",
       "line": 6,
       "also": [
        4
       ],
       "prints": [
        "phase is active"
       ]
      },
      {
       "text": "Line 18 gives the renderer a new `Saver`, whose phase line 19 sets to `.background`, and line 20 asks for the image again.",
       "line": 19,
       "also": [
        18,
        20
       ]
      },
      {
       "text": "SwiftUI keeps the view it drew, and gives it the new phase. Its `body` runs again, and line 6 prints {{phase is background}}.",
       "line": 6,
       "prints": [
        "phase is background"
       ]
      },
      {
       "text": "The phase changed, so SwiftUI calls the closure of `onChange(of:)` with the old and the new phase. Line 9 prints {{from active to background}}.",
       "line": 9,
       "also": [
        8
       ],
       "prints": [
        "from active to background"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "A view reads its scene's phase from the environment, and `onChange(of:)` runs code each time the phase changes, such as when the scene goes to the background."
     }
    }
   }
  },
  "scene": {
   "id": "scene",
   "name": "Scene",
   "area": "ui",
   "first": "A part of an app's user interface whose life cycle the system manages, such as a window, which holds the views it shows.",
   "parts": [
    "window-group"
   ],
   "dependsOn": [
    {
     "id": "view",
     "views": [
      "what"
     ],
     "why": "A scene holds the views that it shows."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "let scene = WindowGroup {",
     "    Text(\"Trips\")",
     "}",
     "print(type(of: scene))"
    ],
    "output": [
     "WindowGroup<Text>"
    ]
   },
   "views": {
    "what": {
     "is": "A scene is a part of an app's user interface whose life cycle the system manages, such as a window. It holds a view, and the system decides when to show it, how many there are, and when they go to the background.",
     "marks": [
      {
       "line": 3,
       "text": "WindowGroup",
       "part": "window-group",
       "label": "a scene"
      }
     ],
     "afterExample": "`WindowGroup` is the scene that SwiftUI provides for an app's windows. It holds a `Text`, and line 6 prints its type, {{WindowGroup<Text>}}.",
     "problem": "An app's views need somewhere to be shown, and the system decides where: in one window on an iPhone, in several windows on an iPad or a Mac. A scene tells the system which views go in each window, and the system makes and removes the windows.",
     "how": "The views given to a `WindowGroup` are the template for each window that the app makes from it. Apple's documentation says that each window keeps its own state: the system makes new storage for the state of the views in each window.",
     "when": [
      {
       "text": "Use a window group for an app's main windows. On an iPad or a Mac, a person can open more than one window from the same group."
      },
      {
       "text": "Don't make a scene to show a view inside a screen. A scene is a whole window, or a part of the system's interface such as a settings window. Inside it, the parts of the screen are views."
      }
     ]
    }
   }
  },
  "scroll-content": {
   "id": "scroll-content",
   "name": "Scroll view content",
   "first": "The views inside a scroll view, which can be longer than the scroll view in the direction it scrolls.",
   "parts": []
  },
  "scroll-view": {
   "id": "scroll-view",
   "name": "Scroll view",
   "area": "ui",
   "first": "A view whose content can be larger than the view itself, and that moves the content as the user scrolls.",
   "parts": [
    "scroll-content"
   ],
   "dependsOn": [
    {
     "id": "stack-view",
     "views": [
      "what",
      "parts"
     ],
     "why": "The content of the scroll view in the example is a stack, which makes all of its views at once.",
     "whyInExample": "The content is a `VStack`, a stack that places its rows in a column, as `HStack` places its views in a row."
    },
    {
     "id": "layout-process",
     "views": [
      "what",
      "parts"
     ],
     "why": "A scroll view lets its content choose a length longer than the scroll view itself.",
     "whyInExample": "The renderer proposes 100 by 100 to the scroll view, and each row chooses its size, as each color does on the page of Layout process."
    },
    {
     "id": "closure",
     "views": [
      "parts"
     ],
     "why": "Each row records that it appeared in a closure, which SwiftUI calls when the row appears.",
     "whyInExample": "The braces after `onAppear` hold a closure that adds the row's `number` to `made`."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "var made: [Int] = []",
     "",
     "struct Row: View {",
     "    let number: Int",
     "    var body: some View {",
     "        Color.blue",
     "            .aspectRatio(2, contentMode: .fit)",
     "            .onAppear { made.append(number) }",
     "    }",
     "}",
     "",
     "let list = ScrollView {",
     "    VStack(spacing: 0) {",
     "        Row(number: 1)",
     "        Row(number: 2)",
     "        Row(number: 3)",
     "        Row(number: 4)",
     "    }",
     "}",
     "let size = CGSize(width: 100, height: 100)",
     "let renderer = ImageRenderer(content: list)",
     "renderer.proposedSize = ProposedViewSize(size)",
     "let image = renderer.cgImage!",
     "print(image.width, image.height)",
     "print(made.sorted())"
    ]
   },
   "views": {
    "what": {
     "is": "A scroll view is a view whose content can be larger than the scroll view itself. It shows the part of the content that fits, and moves the content when the user scrolls. It can scroll vertically, horizontally, or both.",
     "marks": [
      {
       "line": 14,
       "text": "ScrollView",
       "label": "scroll view"
      },
      {
       "line": 15,
       "text": "VStack(spacing: 0)",
       "part": "scroll-content",
       "label": "content"
      }
     ],
     "afterExample": "The scroll view is 100 by 100 points. Its four rows are 50 points tall each, 200 in all, so only two fit at a time. The `VStack` inside it made all four rows, as the list `made` shows.",
     "problem": "Content is often longer than the screen, such as a list of trips. A scroll view lets the content be as long as it needs, and the user moves through it.",
     "how": "A scroll view lets its content choose its full length in the direction it scrolls: here the rows choose 200 points, though the scroll view is 100 points tall. The scroll view itself chooses the size it is proposed, and shows the part of the content that fits.",
     "when": [
      {
       "text": "Use it for content that can be longer than the space it has, such as a list of trips."
      },
      {
       "text": "Don't put hundreds of rows in a plain stack inside it. The stack makes every row at once, as `made` shows here. A lazy stack makes only the rows that are about to be shown."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "scroll-content",
       "name": "The content, lines 15 to 20",
       "text": "The braces after `ScrollView` hold its content: a `VStack` of four rows. Each `Row` is a blue color twice as wide as it is tall. The scroll view lets the stack be as tall as its rows need, 200 points, though the scroll view is 100 points tall."
      }
     ],
     "marks": [
      {
       "line": 15,
       "text": "VStack(spacing: 0)",
       "part": "scroll-content",
       "label": "content"
      }
     ],
     "steps": [
      {
       "text": "Line 3 makes an empty array, `made`, which will hold the number of each row that appears.",
       "line": 3
      },
      {
       "text": "Lines 5 to 12 declare `Row`, a view: a blue color twice as wide as it is tall, which adds its `number` to `made` in the closure of `onAppear`.",
       "line": 5,
       "also": [
        10
       ]
      },
      {
       "text": "Line 14 makes a scroll view whose content is a stack of four rows, numbered 1 to 4.",
       "line": 14,
       "also": [
        15,
        16
       ]
      },
      {
       "text": "Line 23 makes a renderer for the scroll view, and line 24 proposes 100 by 100, the size on line 22.",
       "line": 23,
       "also": [
        22,
        24
       ]
      },
      {
       "text": "Line 25 asks for the image. The scroll view chooses the size it is proposed, and line 26 prints {{100 100}}.",
       "line": 26,
       "also": [
        25
       ],
       "prints": [
        "100 100"
       ]
      },
      {
       "text": "Each row chose 100 by 50, so only rows 1 and 2 fit in the scroll view. But the stack made all four rows, and each one's `onAppear` ran, so line 27 prints {{[1, 2, 3, 4]}}.",
       "line": 27,
       "prints": [
        "[1, 2, 3, 4]"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The content was 200 points tall inside a scroll view 100 points tall, and the plain stack made every row, including the two that did not fit."
     }
    }
   }
  },
  "size-proposal": {
   "id": "size-proposal",
   "name": "Size proposal",
   "first": "The size, as a width and a height, that a parent view offers a child view during layout, which the child takes into account when it chooses its own size.",
   "parts": []
  },
  "size-that-fits": {
   "id": "size-that-fits",
   "name": "Sizing method",
   "first": "The method of a layout that gets a proposal and the views inside the layout, and returns the size that the layout chooses.",
   "parts": []
  },
  "some-keyword": {
   "id": "some-keyword",
   "name": "some",
   "first": "The keyword written before a protocol's name in a type, which makes it an opaque type: one real type that conforms to the protocol, which the code that uses it does not see.",
   "parts": []
  },
  "stack-content": {
   "id": "stack-content",
   "name": "Stack content",
   "first": "The views listed in a stack's braces, which the stack places one after another, in the order they are written.",
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
  "stack-spacing": {
   "id": "stack-spacing",
   "name": "Stack spacing",
   "first": "The distance, in points, that a stack leaves between each two views it places.",
   "parts": []
  },
  "stack-view": {
   "id": "stack-view",
   "name": "Stack view",
   "area": "ui",
   "first": "A view that places the views inside it in a row, in a column, or one on top of another.",
   "parts": [
    "stack-content",
    "stack-spacing"
   ],
   "dependsOn": [
    {
     "id": "layout-process",
     "views": [
      "what",
      "parts"
     ],
     "why": "A stack proposes a size to each view inside it, and chooses its own size from theirs.",
     "whyInExample": "The renderer proposes 300 by 100 to `row`, as it proposes 300 by 200 to each color on the page of Layout process."
    },
    {
     "id": "view-builder",
     "views": [
      "parts"
     ],
     "why": "The views of a stack are listed in a view builder block.",
     "whyInExample": "The two colors in the braces of `HStack` are views on their own lines, as the `Text` is in the `body` of `Card`."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "let row = HStack(spacing: 10) {",
     "    Color.blue.aspectRatio(1, contentMode: .fit)",
     "    Color.green.aspectRatio(1, contentMode: .fit)",
     "}",
     "let size = CGSize(width: 300, height: 100)",
     "let renderer = ImageRenderer(content: row)",
     "renderer.proposedSize = ProposedViewSize(size)",
     "let image = renderer.cgImage!",
     "print(image.width, image.height)"
    ]
   },
   "views": {
    "what": {
     "is": "A stack is a view that places the views inside it one after another. `HStack` places them in a row, from the leading edge to the trailing edge. SwiftUI's other stacks place them in a column, or one on top of another.",
     "marks": [
      {
       "line": 3,
       "text": "HStack",
       "label": "a row"
      },
      {
       "line": 3,
       "text": "spacing: 10",
       "part": "stack-spacing",
       "label": "space between"
      },
      {
       "line": 4,
       "text": "Color.blue.aspectRatio(1, contentMode: .fit)",
       "part": "stack-content",
       "label": "first view"
      },
      {
       "line": 5,
       "text": "Color.green.aspectRatio(1, contentMode: .fit)",
       "part": "stack-content",
       "label": "second view"
      }
     ],
     "afterExample": "The stack is proposed 300 by 100 points. Each square chooses 100 by 100, and the stack chooses the width of both and the space between them: 210 by 100.",
     "problem": "Most screens are rows and columns of views, such as an icon beside a name, or a title above a date. Stacks arrange views in rows and columns without fixed positions, so the views move together when the space changes. In UIKit, Auto Layout constraints did most of this work.",
     "how": "A stack proposes a size to each view inside it. It then chooses its own size from the sizes they chose and the spacing between them, and places them one after another in its direction.",
     "when": [
      {
       "text": "Use a stack for a few views that sit side by side or one above another, such as an icon beside a name."
      },
      {
       "text": "Don't use a plain stack for hundreds of rows. Apple's documentation says that it renders all of its views at once, whether or not they are on the screen. A lazy stack makes only the views that are about to be shown."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "stack-content",
       "name": "The views in the braces, lines 4 and 5",
       "text": "The braces after `HStack` hold the views of the stack, one per line, as a view builder block. The stack places them in that order, from leading to trailing. Each is a `Color` with an aspect ratio of 1, so it chooses a square."
      },
      {
       "part": "stack-spacing",
       "name": "The spacing, line 3",
       "text": "The argument `spacing: 10` makes the stack leave 10 points between each two views. Without it, the stack uses a spacing that SwiftUI chooses for the views."
      }
     ],
     "marks": [
      {
       "line": 3,
       "text": "spacing: 10",
       "part": "stack-spacing",
       "label": "spacing"
      },
      {
       "line": 4,
       "text": "Color.blue.aspectRatio(1, contentMode: .fit)",
       "part": "stack-content",
       "label": "view"
      },
      {
       "line": 5,
       "text": "Color.green.aspectRatio(1, contentMode: .fit)",
       "part": "stack-content",
       "label": "view"
      }
     ],
     "steps": [
      {
       "text": "Line 3 makes an `HStack` that holds two colors, each with an aspect ratio of 1, and stores it in `row`.",
       "line": 3,
       "also": [
        4,
        5
       ]
      },
      {
       "text": "Line 8 makes a renderer for `row`, and line 9 proposes 300 by 100, the size on line 7.",
       "line": 8,
       "also": [
        7,
        9
       ]
      },
      {
       "text": "Line 10 asks for the image. The stack proposes a size to each color, and each chooses a square as tall as the stack: 100 by 100.",
       "line": 10,
       "also": [
        4,
        5
       ]
      },
      {
       "text": "The stack chooses the width of both squares and the 10 points between them, 210 by 100, and places the squares side by side. Line 11 prints {{210 100}}.",
       "line": 11,
       "prints": [
        "210 100"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The stack chose its size from the views inside it, 100 plus 10 plus 100 points wide, and placed them in a row."
     }
    }
   }
  },
  "stack": {
   "id": "stack",
   "name": "Stack",
   "first": "A region of memory, one for each thread, that holds a stack frame for each call that the thread is running.",
   "parts": []
  },
  "state-property": {
   "id": "state-property",
   "name": "State property",
   "first": "A property of a view marked with the State attribute, whose value SwiftUI keeps in storage of its own, and whose changes make SwiftUI run the view's body again.",
   "parts": []
  },
  "state": {
   "id": "state",
   "name": "State",
   "area": "ui",
   "first": "A value that SwiftUI keeps for a view while the view is on the screen, and that makes SwiftUI run the view's body again when it changes.",
   "parts": [
    "state-property"
   ],
   "dependsOn": [
    {
     "id": "view",
     "views": [
      "what",
      "parts"
     ],
     "why": "State belongs to a view, and a change to it makes SwiftUI run that view's body again.",
     "whyInExample": "`taps` is state of `Counter`, a view, and its `body` reads `taps`."
    },
    {
     "id": "property-wrapper",
     "views": [
      "what",
      "parts"
     ],
     "why": "State is a property wrapper that SwiftUI provides, so a state property is a wrapped property.",
     "whyInExample": "`@State` before `taps` makes `taps` a wrapped property of the property wrapper `State`."
    },
    {
     "id": "view-modifier",
     "views": [
      "parts"
     ],
     "why": "The example changes its state in the closure of a modifier that runs when the view appears.",
     "whyInExample": "`onAppear` is a modifier of the `Text`, and its closure adds 1 to `taps`."
    },
    {
     "id": "closure",
     "views": [
      "parts"
     ],
     "why": "The code that changes the state is a closure, which SwiftUI calls later.",
     "whyInExample": "The braces after `onAppear` hold a closure, which SwiftUI calls when the view appears."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Counter: View {",
     "    @State private var taps = 0",
     "    var body: some View {",
     "        let _ = print(\"Taps:\", taps)",
     "        Text(\"Taps: \\(taps)\")",
     "            .onAppear {",
     "                taps += 1",
     "            }",
     "    }",
     "}",
     "",
     "let renderer = ImageRenderer(content: Counter())",
     "_ = renderer.cgImage"
    ]
   },
   "views": {
    "what": {
     "is": "State is a value that SwiftUI keeps for a view. A property marked `@State` keeps its value while SwiftUI makes the view's structure again and again. When code changes the value, SwiftUI runs the view's `body` again, so that what the view shows matches the new value.",
     "marks": [
      {
       "line": 4,
       "text": "@State private var taps = 0",
       "part": "state-property",
       "label": "state"
      }
     ],
     "afterExample": "`Counter` keeps `taps` in state. When the view appears, line 9 adds 1 to `taps`, and SwiftUI runs `body` again, so line 6 prints the new value.",
     "problem": "SwiftUI can make a view's structure again whenever it needs it, so a plain stored property would start from its first value each time. The code in `body` cannot change a stored property either. State keeps a value while the view is on the screen, lets code change it, and shows each change.",
     "how": "SwiftUI keeps the value of a state property in storage of its own, outside the structure. Reading `taps` reads that storage. Writing `taps` changes the storage, and makes SwiftUI run `body` again.",
     "when": [
      {
       "text": "Use state for a value that only this view and the views inside it use, such as how many times a button was tapped. Mark it `private`, because only the view itself sets it."
      },
      {
       "text": "Don't use state for data that several screens share, or that must still be there after the app quits. A state property lasts only while its view is on the screen."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "state-property",
       "name": "The state property `taps`, line 4",
       "text": "The attribute `@State` makes `taps` a wrapped property of `State`, the property wrapper that SwiftUI provides. Its first value is 0, and it is `private`, so only `Counter` reads and writes it. SwiftUI keeps its value, so each time `body` runs, `taps` reads the value that SwiftUI kept."
      }
     ],
     "marks": [
      {
       "line": 4,
       "text": "@State private var taps = 0",
       "part": "state-property",
       "label": "state"
      }
     ],
     "steps": [
      {
       "text": "Line 14 makes a `Counter`, and an `ImageRenderer` for it. An `ImageRenderer` draws a view into an image, as a window draws it on a screen, so this program can run SwiftUI without a window.",
       "line": 14
      },
      {
       "text": "Line 15 asks the renderer for its image, so SwiftUI starts to draw `Counter`. It makes the storage for `taps`, with the value 0, and runs `body`.",
       "line": 15,
       "also": [
        4,
        5
       ]
      },
      {
       "text": "Line 6 reads `taps`, and prints {{Taps: 0}}.",
       "line": 6,
       "prints": [
        "Taps: 0"
       ]
      },
      {
       "text": "The `Text` appears, so SwiftUI calls the closure of `onAppear`. Line 9 adds 1 to `taps`, and the storage that SwiftUI keeps now holds 1.",
       "line": 9,
       "also": [
        8
       ]
      },
      {
       "text": "The state changed, so SwiftUI runs `body` again. Line 6 reads `taps`, which is now 1, and prints {{Taps: 1}}.",
       "line": 6,
       "prints": [
        "Taps: 1"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "SwiftUI keeps the value of `taps`. The change on line 9 made SwiftUI run `body` again, with the new value."
     }
    }
   }
  },
  "stored-property": {
   "id": "stored-property",
   "name": "Stored property",
   "first": "A constant or variable declared in a type, of which every instance of the type holds its own value.",
   "parts": []
  },
  "struct-keyword": {
   "id": "struct-keyword",
   "name": "struct",
   "first": "The keyword that declares a structure. The structure's name comes right after it.",
   "parts": []
  },
  "structure": {
   "id": "structure",
   "name": "Structure",
   "area": "swift",
   "first": "A type that groups values under one name, and whose instances are copied when they are assigned or passed to a function.",
   "parts": [
    "struct-keyword",
    "stored-property",
    "memberwise-initializer"
   ],
   "dependsOn": [
    {
     "id": "function",
     "views": [
      "what",
      "parts"
     ],
     "why": "An instance of a structure is made by calling its initializer, which takes arguments after argument labels, as a function does.",
     "whyInExample": "`Trip(city: \"Lima\", nights: 3)` calls the initializer of `Trip` with two arguments, each after its argument label, as a call of a function does."
    }
   ],
   "example": {
    "code": [
     "struct Trip {",
     "    var city: String",
     "    var nights: Int",
     "}",
     "let first = Trip(city: \"Lima\", nights: 3)",
     "var second = first",
     "second.nights = 5",
     "print(first.nights)",
     "print(second.nights)"
    ]
   },
   "views": {
    "what": {
     "is": "A structure is a type that groups values under one name. Each instance of a structure, one value of its type, holds its own copy of those values. Assigning an instance to a variable, or passing it to a function, copies it.",
     "marks": [
      {
       "line": 1,
       "text": "struct",
       "part": "struct-keyword",
       "label": "structure"
      },
      {
       "line": 2,
       "text": "var city: String",
       "part": "stored-property",
       "label": "a value it groups"
      },
      {
       "line": 3,
       "text": "var nights: Int",
       "part": "stored-property",
       "label": "a value it groups"
      }
     ],
     "afterExample": "`Trip` groups a city and a number of nights. Line 6 copies `first` into `second`, so when line 7 changes `second`, `first` still has 3 nights.",
     "problem": "Values that belong together, such as the city and the number of nights of one trip, are easier to use as one value. A structure gives them one name, so code passes one `Trip` instead of a separate `String` and `Int`.",
     "how": "Each instance holds a value for every stored property of the structure. Assigning the instance to another variable copies all of those values, so `first` and `second` are separate instances after line 6.",
     "when": [
      {
       "text": "Use a structure for a group of values that should be copied, such as the details of a trip that a screen shows, so that changing one copy never changes another."
      },
      {
       "text": "Don't use one when several parts of a program must share one instance and see each other's changes. A class does that: assigning an instance of a class copies only its address."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "struct-keyword",
       "name": "The keyword `struct`, line 1",
       "text": "The keyword `struct` declares a structure. The structure's name, `Trip`, comes right after it, and its stored properties are between the braces on lines 1 and 4."
      },
      {
       "part": "stored-property",
       "name": "The stored properties, lines 2 and 3",
       "text": "Lines 2 and 3 declare the stored properties of `Trip`: `city`, of type `String`, and `nights`, of type `Int`. Every instance of `Trip` holds its own value for each one. They are declared with `var`, so an instance in a variable can change them."
      },
      {
       "part": "memberwise-initializer",
       "name": "The memberwise initializer, line 5",
       "text": "An initializer is code that makes a new instance of a type. `Trip` declares none, so swiftc writes one for it, called the memberwise initializer. It has a parameter for each stored property, with the property's name as its argument label. Line 5 calls it with `\"Lima\"` and 3."
      }
     ],
     "marks": [
      {
       "line": 1,
       "text": "struct",
       "part": "struct-keyword",
       "label": "keyword"
      },
      {
       "line": 2,
       "text": "var city: String",
       "part": "stored-property",
       "label": "stored property"
      },
      {
       "line": 3,
       "text": "var nights: Int",
       "part": "stored-property",
       "label": "stored property"
      },
      {
       "line": 5,
       "text": "Trip(city: \"Lima\", nights: 3)",
       "part": "memberwise-initializer",
       "label": "memberwise initializer"
      }
     ],
     "steps": [
      {
       "text": "Line 5 calls the memberwise initializer of `Trip`. It makes an instance whose `city` is `\"Lima\"` and whose `nights` is 3, and stores it in the constant `first`.",
       "line": 5,
       "also": [
        2,
        3
       ]
      },
      {
       "text": "Line 6 copies the instance in `first`, and stores the copy in the variable `second`. There are now two instances of `Trip`, with the same values.",
       "line": 6
      },
      {
       "text": "Line 7 sets `nights` of `second` to 5. Only the instance in `second` changes.",
       "line": 7,
       "value": {
        "line": 7,
        "name": "second.nights",
        "is": "5"
       }
      },
      {
       "text": "Line 8 prints the `nights` of `first`, which is still 3: {{3}}.",
       "line": 8,
       "prints": [
        "3"
       ]
      },
      {
       "text": "Line 9 prints the `nights` of `second`: {{5}}.",
       "line": 9,
       "prints": [
        "5"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "Each instance of a structure holds its own values. Line 6 made a copy, so the change on line 7 did not reach `first`."
     }
    }
   }
  },
  "suspension-point": {
   "id": "suspension-point",
   "name": "Suspension point",
   "first": "A place where code can suspend: stop running, and free its thread, until the call it waits for returns. Each await marks one.",
   "parts": []
  },
  "text": {
   "id": "text",
   "name": "Text",
   "area": "ui",
   "first": "A view that shows one or more lines of text that the user cannot edit.",
   "parts": [],
   "dependsOn": [
    {
     "id": "view",
     "views": [
      "what"
     ],
     "why": "A text is a view that SwiftUI provides and draws itself."
    },
    {
     "id": "view-modifier",
     "views": [
      "what"
     ],
     "why": "A text has modifiers of its own, which return a text, beside the modifiers of every view, which return a new view around it."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "let city = Text(\"Lima\").bold()",
     "let line = Text(\"\\(city) for 3 nights\")",
     "print(type(of: city))",
     "print(type(of: line))",
     "print(type(of: city.padding(4)))"
    ],
    "output": [
     "Text",
     "Text",
     "ModifiedContent<Text, _PaddingLayout>"
    ]
   },
   "views": {
    "what": {
     "is": "A `Text` is a view that shows one or more lines of text that the user cannot edit. SwiftUI draws it in the system's font, with the size and color that the environment gives it, and wraps it onto more lines when it does not fit.",
     "marks": [
      {
       "line": 3,
       "text": "bold()",
       "label": "returns a Text"
      },
      {
       "line": 7,
       "text": "padding(4)",
       "label": "returns a new view"
      }
     ],
     "afterExample": "`bold()` is a modifier of `Text` that returns a `Text`, so line 4 can put `city` inside another `Text`. `padding(4)` is a modifier of every view, which returns a new view around the text, as line 7 prints.",
     "problem": "Almost every screen shows words: names, numbers, dates, and labels. A `Text` shows a string in a font that suits the platform, in the reader's language when the app has a translation, and in the size the reader chose in Settings.",
     "how": "Apple's documentation says that a text view draws a string in a font that is right for the current platform. A string written straight in the parentheses, as `\"Lima\"`, is also a key that SwiftUI looks up in the app's translations. Modifiers of `Text`, such as `bold()`, return a `Text`, so styled text can be joined into one.",
     "when": [
      {
       "text": "Use it for any words a screen shows, and use its own modifiers, such as `bold()`, for the style of part of a line."
      },
      {
       "text": "Don't use it for words the user types or changes. A text field edits a string, through a binding."
      }
     ]
    }
   }
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
  "underlying-type": {
   "id": "underlying-type",
   "name": "Underlying type",
   "first": "The one real type behind an opaque type, which swiftc works out from the code that makes the value.",
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
  "view-body": {
   "id": "view-body",
   "name": "View body",
   "first": "The computed property that every view has, whose value is the views that the view is made of.",
   "parts": []
  },
  "view-builder-if": {
   "id": "view-builder-if",
   "name": "If statement in a view builder",
   "first": "An if statement in a block that the view builder builds, whose views are there only when its condition is true.",
   "parts": []
  },
  "view-builder-line": {
   "id": "view-builder-line",
   "name": "View on its own line",
   "first": "A view written on its own line in a block that the view builder builds, which becomes one of the views that the block combines.",
   "parts": []
  },
  "view-builder": {
   "id": "view-builder",
   "name": "View builder",
   "area": "ui",
   "first": "The result builder that SwiftUI provides for views, which builds a view's body from the views it lists, one per line, and from the if statements among them.",
   "parts": [
    "view-builder-line",
    "view-builder-if"
   ],
   "dependsOn": [
    {
     "id": "view",
     "views": [
      "what",
      "parts"
     ],
     "why": "The view builder builds the body of a view.",
     "whyInExample": "The view builder builds the `body` of `Card`, a view."
    },
    {
     "id": "result-builder",
     "views": [
      "what",
      "parts"
     ],
     "why": "The view builder is a result builder, so swiftc builds each body with its static methods.",
     "whyInExample": "The `body` of `Card` lists its views with no `return`, as the body of `packing()` lists its strings."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Card: View {",
     "    let isFavorite: Bool",
     "    var body: some View {",
     "        Text(\"Lima\")",
     "        if isFavorite {",
     "            Text(\"Favorite\")",
     "        }",
     "    }",
     "}",
     "",
     "print(type(of: Card(isFavorite: true).body))"
    ],
    "sil": [
     {
      "in": "Card.body.getter",
      "has": "function_ref static ViewBuilder.buildIf<A>(_:)",
      "shows": "swiftc built the if statement in body with the view builder's method for an if statement."
     },
     {
      "in": "Card.body.getter",
      "has": "function_ref static ViewBuilder.buildBlock<each A>(_:)",
      "shows": "swiftc combined the views of body with the view builder's buildBlock."
     }
    ]
   },
   "views": {
    "what": {
     "is": "The view builder is the result builder that SwiftUI provides for views. The protocol `View` marks `body` with it, so the `body` of every view can list its views one per line, with no return statement, and can use `if` statements to choose views. The view builder combines them into one view.",
     "marks": [
      {
       "line": 6,
       "text": "Text(\"Lima\")",
       "part": "view-builder-line",
       "label": "a view"
      },
      {
       "line": 7,
       "text": "if",
       "part": "view-builder-if",
       "label": "a view only when true"
      }
     ],
     "afterExample": "The `body` of `Card` lists a `Text`, and another `Text` inside an `if`. Line 13 prints the type of the one view that the view builder made from them.",
     "problem": "A view is usually made of several views, and some of them are shown only sometimes. Combined by hand, each combination would need code that names its type. The view builder lets `body` list the views and use `if`, and works out the type for it.",
     "how": "When swiftc builds the program, it builds `body` with the view builder. Views on separate lines become one view that holds them all, of a type that SwiftUI calls a tuple view. A view inside an `if` becomes an optional view, which is there only when the condition is true.",
     "when": [
      {
       "text": "Use it in every `body`, without writing it: list the views in order, and use `if` for a view that is shown only sometimes."
      },
      {
       "text": "Don't write a for loop in `body` to repeat a view. The view builder has no method for loops, so swiftc reports that a closure containing control flow statement cannot be used with result builder ViewBuilder. SwiftUI's ForEach repeats views instead."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "view-builder-line",
       "name": "The view on line 6",
       "text": "The `Text` on line 6 is written on its own line, with no return statement. The view builder takes it as the first view of the block."
      },
      {
       "part": "view-builder-if",
       "name": "The `if` statement, lines 7 to 9",
       "text": "The `if` statement holds a second `Text`, which is in the view only when `isFavorite` is true. The view builder turns it into an optional view: a view that holds the `Text` when the condition is true, and nothing when it is false."
      }
     ],
     "marks": [
      {
       "line": 6,
       "text": "Text(\"Lima\")",
       "part": "view-builder-line",
       "label": "view"
      },
      {
       "line": 7,
       "text": "if",
       "part": "view-builder-if",
       "label": "if statement"
      }
     ],
     "steps": [
      {
       "text": "Line 13 makes a `Card` whose `isFavorite` is true, and reads its `body`.",
       "line": 13,
       "also": [
        4
       ]
      },
      {
       "text": "swiftc built `body` with the view builder. The `Text` on line 6 is its first view.",
       "line": 6
      },
      {
       "text": "`isFavorite` is true, so the `if` statement on line 7 gives the `Text` from line 8, as an optional view that holds it.",
       "line": 7,
       "also": [
        8
       ]
      },
      {
       "text": "The view builder combines the two into one view, and line 13 prints its type: {{TupleView<(Text, Optional<Text>)>}}. It holds a `Text`, and an optional `Text`.",
       "line": 13,
       "prints": [
        "TupleView<(Text, Optional<Text>)>"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The view builder combined the lines of `body` into one view, and turned the `if` statement into an optional view."
     }
    }
   }
  },
  "view-modifier": {
   "id": "view-modifier",
   "name": "View modifier",
   "area": "ui",
   "first": "A method of a view that returns a new view, which holds the original view and one change to it, such as space around it.",
   "parts": [
    "modifier-call"
   ],
   "dependsOn": [
    {
     "id": "view",
     "views": [
      "what",
      "parts"
     ],
     "why": "A modifier is called on a view, and returns a view.",
     "whyInExample": "`city` is a `Text`, a view, and `padding(8)` returns a new view that holds it."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "let city = Text(\"Lima\")",
     "let padded = city.padding(8)",
     "let faded = padded.opacity(0.5)",
     "print(type(of: city))",
     "print(type(of: padded))",
     "print(type(of: faded))"
    ]
   },
   "views": {
    "what": {
     "is": "A view modifier is a method that every view has, such as `padding(8)` or `opacity(0.5)`. It does not change the view it is called on. It returns a new view that holds that view and the change.",
     "marks": [
      {
       "line": 4,
       "text": "padding(8)",
       "part": "modifier-call",
       "label": "modifier"
      },
      {
       "line": 5,
       "text": "opacity(0.5)",
       "part": "modifier-call",
       "label": "modifier"
      }
     ],
     "afterExample": "Lines 6 to 8 print the type of each view. `padded` is a new view that holds `city`, and `faded` is a new view that holds `padded`.",
     "problem": "Views need many small changes, such as space around them, a color, or a size. A modifier adds one change at a time to any view, so no new type of view is needed for each mix of changes.",
     "how": "Each modifier returns a new view, of a type that SwiftUI calls modified content, which holds the view it was called on and the change. Calling several modifiers in a row puts each new view around the one before, so the order of the calls is the order of the nesting.",
     "when": [
      {
       "text": "Use modifiers to change how a view looks or behaves, in the order the changes should happen. Space added before a background is inside the background, and space added after it is outside."
      },
      {
       "text": "Don't expect a modifier to change the view in a variable. `city` is still a plain `Text` after line 4: the change is in the new view, `padded`."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "modifier-call",
       "name": "The modifier calls, lines 4 and 5",
       "text": "Line 4 calls `padding(8)` on `city`, which returns a new view with 8 points of space around `city`. Line 5 calls `opacity(0.5)` on that new view, which returns another view that draws it half transparent. Neither call changes the view it is called on."
      }
     ],
     "marks": [
      {
       "line": 4,
       "text": "padding(8)",
       "part": "modifier-call",
       "label": "modifier"
      },
      {
       "line": 5,
       "text": "opacity(0.5)",
       "part": "modifier-call",
       "label": "modifier"
      }
     ],
     "steps": [
      {
       "text": "Line 3 makes a `Text` that shows `\"Lima\"`, and stores it in `city`.",
       "line": 3
      },
      {
       "text": "Line 4 calls `padding(8)` on `city`. It returns a new view that holds `city` and the padding, and line 4 stores it in `padded`.",
       "line": 4
      },
      {
       "text": "Line 5 calls `opacity(0.5)` on `padded`, and stores the new view, which holds `padded`, in `faded`.",
       "line": 5
      },
      {
       "text": "Line 6 prints the type of `city`, which is still {{Text}}.",
       "line": 6,
       "prints": [
        "Text"
       ]
      },
      {
       "text": "Line 7 prints the type of `padded`: {{ModifiedContent<Text, _PaddingLayout>}}. It holds a `Text` and the padding.",
       "line": 7,
       "prints": [
        "ModifiedContent<Text, _PaddingLayout>"
       ]
      },
      {
       "text": "Line 8 prints the type of `faded`, which holds the type of `padded` inside it: {{ModifiedContent<ModifiedContent<Text, _PaddingLayout>, _OpacityEffect>}}.",
       "line": 8,
       "prints": [
        "ModifiedContent<ModifiedContent<Text, _PaddingLayout>, _OpacityEffect>"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "A modifier returns a new view around the view it is called on. Each modifier in a row adds one more layer, in the order they are written."
     }
    }
   }
  },
  "view-update": {
   "id": "view-update",
   "name": "View update",
   "area": "ui",
   "first": "SwiftUI running a view's body again when a value that the body read changes, and not when a value it did not read changes.",
   "parts": [
    "body-dependency"
   ],
   "dependsOn": [
    {
     "id": "state",
     "views": [
      "what",
      "parts"
     ],
     "why": "The example changes state, one of the values that make SwiftUI run a body again.",
     "whyInExample": "`taps` and `visits` are state properties, as `taps` is in `Counter` on the page of State."
    },
    {
     "id": "view-modifier",
     "views": [
      "parts"
     ],
     "why": "The example changes its state in the closure of a modifier that runs when a view appears.",
     "whyInExample": "`onAppear` is a modifier of each `Text`, whose closure changes the state."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Welcome: View {",
     "    @State private var visits = 0",
     "    var body: some View {",
     "        let _ = print(\"Welcome body runs\")",
     "        Text(\"Welcome\")",
     "            .onAppear {",
     "                visits += 1",
     "            }",
     "    }",
     "}",
     "",
     "struct Counter: View {",
     "    @State private var taps = 0",
     "    var body: some View {",
     "        let _ = print(\"Counter body runs:\", taps)",
     "        Text(\"Taps: \\(taps)\")",
     "            .onAppear {",
     "                taps += 1",
     "            }",
     "    }",
     "}",
     "",
     "let welcome = ImageRenderer(content: Welcome())",
     "_ = welcome.cgImage",
     "let counter = ImageRenderer(content: Counter())",
     "_ = counter.cgImage"
    ]
   },
   "views": {
    "what": {
     "is": "A view update is SwiftUI running a view's `body` again, to get a new description of the view. SwiftUI does it when a value that `body` read the last time it ran changes, such as a state property. A change to a value that `body` did not read does not run it again.",
     "marks": [
      {
       "line": 9,
       "text": "visits",
       "label": "never read by body"
      },
      {
       "line": 17,
       "text": "taps",
       "part": "body-dependency",
       "label": "read by body"
      }
     ],
     "afterExample": "Both views change a state property when they appear. Only `Counter` reads its state in `body`, so only the `body` of `Counter` runs a second time.",
     "problem": "A screen must show the newest data, but running every view's `body` after every change would do work that changes nothing. SwiftUI runs again only the bodies that read what changed.",
     "how": "Apple's documentation says that when a state value changes, SwiftUI updates the parts of the view hierarchy that depend on it. A `body` depends on the values it read when it last ran. Here, `body` of `Welcome` never read `visits`, so its change ran nothing, while `body` of `Counter` read `taps`, so its change ran that `body` again.",
     "when": [
      {
       "text": "Use it to keep updates small: read in `body` only the values that the view shows, and give each view inside it only the values that it needs."
      },
      {
       "text": "Don't count on `body` running a set number of times. SwiftUI runs it whenever it needs a new description, so `body` should not do work with effects, such as saving data."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "body-dependency",
       "name": "The value `taps`, read on line 17",
       "text": "The `body` of `Counter` reads `taps` on lines 17 and 18, so `taps` is a value that this `body` depends on. The `body` of `Welcome` never reads `visits`, so it does not depend on `visits`."
      }
     ],
     "marks": [
      {
       "line": 17,
       "text": "taps",
       "part": "body-dependency",
       "label": "read by body"
      },
      {
       "line": 18,
       "text": "taps",
       "part": "body-dependency",
       "label": "read by body"
      }
     ],
     "steps": [
      {
       "text": "Line 25 makes a `Welcome` and a renderer for it, and line 26 asks for its image, so SwiftUI draws it.",
       "line": 25,
       "also": [
        26
       ]
      },
      {
       "text": "The `body` of `Welcome` runs, and line 6 prints {{Welcome body runs}}.",
       "line": 6,
       "prints": [
        "Welcome body runs"
       ]
      },
      {
       "text": "The `Text` appears, and line 9 adds 1 to `visits`. The `body` did not read `visits`, so SwiftUI does not run it again.",
       "line": 9,
       "also": [
        8
       ]
      },
      {
       "text": "Line 27 makes a `Counter` and a renderer for it, and line 28 asks for its image.",
       "line": 27,
       "also": [
        28
       ]
      },
      {
       "text": "The `body` of `Counter` runs, and line 17 reads `taps` and prints {{Counter body runs: 0}}.",
       "line": 17,
       "prints": [
        "Counter body runs: 0"
       ]
      },
      {
       "text": "The `Text` appears, and line 20 adds 1 to `taps`, which the `body` read.",
       "line": 20,
       "also": [
        19
       ]
      },
      {
       "text": "A value that the `body` read changed, so SwiftUI runs it again, and line 17 prints {{Counter body runs: 1}}.",
       "line": 17,
       "prints": [
        "Counter body runs: 1"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "SwiftUI ran a `body` again only when a value it had read changed: `taps`, and not `visits`."
     }
    }
   }
  },
  "view": {
   "id": "view",
   "name": "View",
   "area": "ui",
   "first": "A type that describes part of an app's user interface, with a body that says which views it is made of.",
   "parts": [
    "conformance",
    "view-body"
   ],
   "dependsOn": [
    {
     "id": "structure",
     "views": [
      "what",
      "parts"
     ],
     "why": "The views of a SwiftUI app are usually structures, whose stored properties hold the values they show.",
     "whyInExample": "`Greeting` is a structure, and its stored property `name` holds the name that it shows."
    },
    {
     "id": "protocol",
     "views": [
      "what",
      "parts"
     ],
     "why": "A view is a type that conforms to SwiftUI's view protocol, which requires a body.",
     "whyInExample": "`Greeting` conforms to the protocol `View`, and has the `body` that `View` requires."
    },
    {
     "id": "opaque-type",
     "views": [
      "what",
      "parts"
     ],
     "why": "The type of a view's body is an opaque type, so the body can return any view while its declaration names only the view protocol.",
     "whyInExample": "The type of `body` is `some View`. Its real type is `Text`, which swiftc works out from the body."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Greeting: View {",
     "    let name: String",
     "    var body: some View {",
     "        Text(\"Hello, \\(name)\")",
     "    }",
     "}",
     "",
     "let greeting = Greeting(name: \"Ana\")",
     "print(type(of: greeting.body))"
    ]
   },
   "views": {
    "what": {
     "is": "A view is a type that describes part of an app's user interface. It conforms to the protocol `View`, which requires one property, `body`, whose value is the views that this view is made of. A view is a description: SwiftUI reads it, and draws what it describes.",
     "marks": [
      {
       "line": 3,
       "text": "View",
       "part": "conformance",
       "label": "a view"
      },
      {
       "line": 5,
       "text": "body",
       "part": "view-body",
       "label": "what it is made of"
      }
     ],
     "afterExample": "`Greeting` describes a text that says hello to `name`. Its `body` returns a `Text`, a view that SwiftUI provides and draws itself.",
     "problem": "A screen is built from many parts, such as a title, a list, and a button. A view lets each part be written once, as a type, and used inside other views. SwiftUI reads the views and draws the screen from them, so the code says what the screen shows, not the steps that draw it.",
     "how": "SwiftUI reads a view's `body` to learn what the view is made of, and reads the `body` of each view inside it, down to views that SwiftUI draws itself, such as `Text`. Reading `body` makes no window and draws nothing: it returns a value that describes the views.",
     "when": [
      {
       "text": "Use a view for each part of a screen that has a name and a job, such as a greeting, so that other views can use it by name, as `Greeting(name: \"Ana\")`."
      },
      {
       "text": "Don't put work that takes long, or that changes data, in `body`. SwiftUI reads `body` each time it needs the description again, which can be often."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "conformance",
       "name": "The conformance to `View`, line 3",
       "text": "The colon and the name `View` after `Greeting` say that `Greeting` conforms to the protocol `View`. `View` requires one property, `body`. SwiftUI can show any type that conforms to `View`."
      },
      {
       "part": "view-body",
       "name": "The property `body`, lines 5 to 7",
       "text": "A computed property runs its code each time it is read, and returns a value. Lines 5 to 7 declare `body`, the computed property that `View` requires. Its type is `some View`, and here it returns a `Text` that says hello to `name`."
      }
     ],
     "marks": [
      {
       "line": 3,
       "text": "View",
       "part": "conformance",
       "label": "conformance"
      },
      {
       "line": 5,
       "text": "body",
       "part": "view-body",
       "label": "body"
      }
     ],
     "steps": [
      {
       "text": "Line 10 makes a `Greeting` with the name `\"Ana\"`, and stores it in `greeting`. Nothing is drawn: `greeting` is a value that holds one string.",
       "line": 10,
       "also": [
        4
       ]
      },
      {
       "text": "Line 11 reads `greeting.body`. The code of `body` runs, and line 6 returns a `Text` that says hello to `name`.",
       "line": 11,
       "also": [
        6
       ]
      },
      {
       "text": "Line 11 prints the type of the value that `body` returned: {{Text}}.",
       "line": 11,
       "prints": [
        "Text"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "A view is a value that describes part of a user interface. Its `body` returns the views it is made of, and SwiftUI draws from that description."
     }
    }
   }
  },
  "window-group": {
   "id": "window-group",
   "name": "Window group",
   "first": "A scene that presents windows that all show the same views, each window with state of its own.",
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
