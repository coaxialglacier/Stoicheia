// Made by library/build.js from concepts/, known.json, and planned.json. Do not edit it: change those files, and run node library/build.js.
const LIBRARY = {
 "entries": {
  "accessibility-label": {
   "id": "accessibility-label",
   "name": "Accessibility label",
   "first": "The words that VoiceOver reads for a view, which SwiftUI makes from the view's text, and a modifier can give or change.",
   "parts": []
  },
  "accessibility-trait": {
   "id": "accessibility-trait",
   "name": "Accessibility trait",
   "first": "What kind of thing a view is, such as a button, a header, or a picture, which VoiceOver reads after the label and uses to say how to use the view.",
   "parts": []
  },
  "accessibility": {
   "id": "accessibility",
   "name": "Accessibility",
   "area": "ui",
   "first": "What assistive technologies, such as VoiceOver, read and do for each view, which SwiftUI makes from the views themselves, and which modifiers can change.",
   "parts": [
    "accessibility-label",
    "accessibility-trait"
   ],
   "dependsOn": [
    {
     "id": "view-modifier",
     "views": [
      "what"
     ],
     "why": "A view's accessibility is changed with modifiers.",
     "whyInExample": "The call `accessibilityLabel` is a modifier of the star, as `padding(8)` is a modifier of `city`."
    },
    {
     "id": "image",
     "views": [
      "what"
     ],
     "why": "An image of a symbol shows no words, so it needs a label for VoiceOver to read.",
     "whyInExample": "The image `Image(systemName: \"star.fill\")` shows a symbol, as `Image(systemName: \"star\")` does on the page of Image."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "let star = Image(systemName: \"star.fill\")",
     "    .accessibilityLabel(\"Favorite\")",
     "    .accessibilityAddTraits(.isButton)",
     "let nights = Text(\"3\")",
     "    .accessibilityLabel(\"3 nights\")",
     "print(type(of: star))",
     "print(type(of: nights))"
    ],
    "output": [
     "ModifiedContent<Image, AccessibilityAttachmentModifier>",
     "Text"
    ]
   },
   "views": {
    "what": {
     "is": "Accessibility is what assistive technologies, such as VoiceOver, which reads the screen aloud, read and do for each view. SwiftUI makes it from the views: a `Text` is read as its words, and a button is read as a button. Modifiers change it, such as `accessibilityLabel`, which says what VoiceOver reads, and `accessibilityAddTraits`, which says what kind of thing a view is.",
     "marks": [
      {
       "line": 4,
       "text": "accessibilityLabel(\"Favorite\")",
       "part": "accessibility-label",
       "label": "what VoiceOver reads"
      },
      {
       "line": 5,
       "text": "accessibilityAddTraits(.isButton)",
       "part": "accessibility-trait",
       "label": "what kind of thing"
      }
     ],
     "afterExample": "VoiceOver would read the star as Favorite, a button, in place of the symbol's name, and the number 3 as 3 nights. A program with no screen reader prints the types: the image with a modifier that holds its accessibility, and a `Text`, whose label stays part of the text.",
     "problem": "Many people use an iPhone without seeing the screen, or with larger text, or with a switch in place of touch. A symbol or a number alone can mean nothing when it is read aloud. Accessibility gives each view words and a kind, so that everyone can use the app.",
     "how": "SwiftUI builds the accessibility of each view from what the view is: the words of a `Text`, the title of a button, and that a toggle is on or off. Apple's documentation says to give a label to a view that shows no text, such as an icon, and not to repeat in the label what a trait already says, such as the word button.",
     "when": [
      {
       "text": "Use a label for every view that shows no words, such as a symbol, and for words that mean little alone, such as a number without its unit."
      },
      {
       "text": "Don't label a view whose words already say what it is, such as a `Text` of a city. SwiftUI already reads it, and a label that repeats it says it twice."
      }
     ]
    }
   }
  },
  "active-phase": {
   "id": "active-phase",
   "name": "Active phase",
   "first": "The phase of a scene that is in the foreground, where a person can use it.",
   "parts": []
  },
  "adaptive-color": {
   "id": "adaptive-color",
   "name": "Color for each mode",
   "first": "A color with a value for light mode and a value for dark mode, such as a system color, which SwiftUI resolves with the environment it is drawn in.",
   "parts": []
  },
  "add-line": {
   "id": "add-line",
   "name": "Line of a path",
   "first": "A straight line that a path adds from its current point to a new point, which becomes the current point.",
   "parts": []
  },
  "alert-action": {
   "id": "alert-action",
   "name": "Alert action",
   "first": "A button of an alert, which runs its code when the user taps it and then dismisses the alert, and which can have a role, such as cancel.",
   "parts": []
  },
  "alert": {
   "id": "alert",
   "name": "Alert",
   "area": "ui",
   "first": "A message with buttons that SwiftUI shows over the screen while a binding is true, which the user must answer before going on.",
   "parts": [
    "sheet-binding",
    "alert-action"
   ],
   "dependsOn": [
    {
     "id": "sheet",
     "views": [
      "what"
     ],
     "why": "An alert is presented from a binding to a value of true or false, as a sheet is.",
     "whyInExample": "The argument `isPresented: $asking` presents the alert, as `isPresented: $editing` presents the sheet on the page of Sheet."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Trash: View {",
     "    @State private var asking = true",
     "    var body: some View {",
     "        Text(\"Lima\")",
     "            .alert(\"Delete Lima?\",",
     "                   isPresented: $asking) {",
     "                Button(\"Delete\") {}",
     "                Button(\"Cancel\", role: .cancel) {}",
     "            }",
     "    }",
     "}",
     "print(type(of: Trash().body))"
    ],
    "output": [
     "ModifiedContent<Text, AlertModifier<ModifiedContent<TupleView<(Button<Text>, Button<Text>)>, ActionsModifier>, EmptyView>>"
    ]
   },
   "views": {
    "what": {
     "is": "An alert is a message with buttons that SwiftUI shows over the screen, and the user taps one of the buttons before going on. The modifier `alert` is given a title and a binding to a value of true or false, and shows the alert while the value is true. Each `Button` in its braces is one of the alert's buttons, with a title and code that runs when it is tapped.",
     "marks": [
      {
       "line": 8,
       "text": "isPresented: $asking",
       "part": "sheet-binding",
       "label": "shown while true"
      },
      {
       "line": 9,
       "text": "Button(\"Delete\") {}",
       "part": "alert-action",
       "label": "an action"
      },
      {
       "line": 10,
       "text": "Button(\"Cancel\", role: .cancel) {}",
       "part": "alert-action",
       "label": "the cancel action"
      }
     ],
     "afterExample": "The state `asking` starts true, so in an app the alert would ask Delete Lima?, with two buttons, Delete and Cancel. A program with no window shows no alert, so line 14 prints the type of the `body`: the `Text`, with a modifier that holds the two buttons.",
     "problem": "Some moments need the user's answer before anything else happens, such as before deleting a trip that cannot be brought back. An alert stops the user, says what will happen, and offers a choice.",
     "how": "Apple's documentation says that every button of an alert dismisses the alert after its code runs, and that the system then sets the binding to false. An alert with no buttons gets an OK button. An alert has no cancel button unless it is given a button whose role is `.cancel`, as on line 10.",
     "when": [
      {
       "text": "Use an alert for a short question that needs an answer now, such as whether to delete a trip, or to say that something failed."
      },
      {
       "text": "Don't use an alert for a task that needs more than a choice, such as typing a name. A sheet can hold any view."
      }
     ]
    }
   }
  },
  "animatable-data": {
   "id": "animatable-data",
   "name": "Animatable data",
   "first": "The property of a shape or a view that SwiftUI sets to each value between the old one and the new one during an animation, and which the shape's own values are read from and written to.",
   "parts": []
  },
  "animatable-shape": {
   "id": "animatable-shape",
   "name": "Animatable shape",
   "area": "ui",
   "first": "A shape whose own values SwiftUI changes a little on each frame of an animation, because the shape says which of its values to animate.",
   "parts": [
    "animatable-data"
   ],
   "dependsOn": [
    {
     "id": "animation",
     "views": [
      "what",
      "parts"
     ],
     "why": "An animatable shape changes smoothly during an animation, from its old values to its new ones.",
     "whyInExample": "A change of `width` made inside `withAnimation`, as `moved` is changed on the page of Animation, would animate the bar."
    },
    {
     "id": "shape",
     "views": [
      "what",
      "parts"
     ],
     "why": "An animatable shape is a shape, which draws its outline again for each value.",
     "whyInExample": "The type `Bar` conforms to `Shape` and has `path(in:)`, as `Pennant` does."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Bar: Shape {",
     "    var width: Double",
     "    var animatableData: Double {",
     "        get { width }",
     "        set { width = newValue }",
     "    }",
     "    func path(in rect: CGRect) -> Path {",
     "        var bar = rect",
     "        bar.size.width = width",
     "        return Path(bar)",
     "    }",
     "}",
     "",
     "let size = CGSize(width: 100, height: 10)",
     "let frame = CGRect(origin: .zero, size: size)",
     "var bar = Bar(width: 0)",
     "for step in [0.0, 0.5, 1.0] {",
     "    bar.animatableData = 100 * step",
     "    print(bar.path(in: frame).boundingRect.width)",
     "}"
    ]
   },
   "snippets": {
    "plain": {
     "code": [
      "import SwiftUI",
      "",
      "struct Bar: Shape {",
      "    var width: Double",
      "    func path(in rect: CGRect) -> Path {",
      "        Path(rect)",
      "    }",
      "}",
      "print(type(of: Bar(width: 0).animatableData))"
     ],
     "output": [
      "EmptyAnimatableData"
     ]
    }
   },
   "views": {
    "what": {
     "is": "An animatable shape is a shape whose own values SwiftUI changes a little at a time during an animation, so that its outline changes smoothly. The shape says which value to animate with its property `animatableData`. Apple's documentation says that SwiftUI reads the old and the new value of `animatableData`, and on each frame sets it to a value between them.",
     "marks": [
      {
       "line": 5,
       "text": "var animatableData: Double",
       "part": "animatable-data",
       "label": "the value to animate"
      }
     ],
     "afterExample": "The shape `Bar` animates its `width`. If a change of `width` from 0 to 100 were animated, SwiftUI would set `animatableData` to each value in between, frame by frame, and draw the path for each. Lines 19 to 22 do that by hand, for three frames.",
     "problem": "SwiftUI knows how to change an offset or an opacity a little at a time. It cannot know which value of a shape of your own to change, such as the width of a bar in a chart, so without help the bar is drawn at its new width at once. The property `animatableData` tells SwiftUI which value to change.",
     "how": "SwiftUI reads `animatableData` before and after the change, and works out the values between them for each frame of the animation. It calls the setter of `animatableData` with each one, which sets `width`, and then calls `path(in:)`, which draws the bar at that width.",
     "when": [
      {
       "text": "Use it for a shape of your own whose outline should change smoothly, such as a bar of a chart, or a ring that fills."
      },
      {
       "text": "Don't leave it out of such a shape. Without it, the shape's animatable data is empty, so SwiftUI has nothing to change a little at a time, and the shape is drawn with its new outline at once:",
       "snippet": "plain"
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "animatable-data",
       "name": "The property `animatableData`, lines 5 to 8",
       "text": "The property `animatableData` is the value that SwiftUI animates. Its getter returns `width`, and its setter sets `width`, so each value that SwiftUI sets during an animation becomes the bar's width. Its type is `Double`, a number that SwiftUI can work out values between."
      }
     ],
     "marks": [
      {
       "line": 5,
       "text": "var animatableData: Double",
       "part": "animatable-data",
       "label": "animatable data"
      }
     ],
     "steps": [
      {
       "text": "Lines 16 and 17 make a rectangle of 100 by 10, and line 18 makes a `Bar` whose `width` is 0.",
       "line": 18,
       "also": [
        16,
        17
       ]
      },
      {
       "text": "The loop on line 19 takes three moments of an animation from 0 to 100: its start, its middle, and its end.",
       "line": 19
      },
      {
       "text": "At the start, line 20 sets `animatableData` to 0, whose setter sets `width` to 0. Line 21 draws the path and prints its width: {{0.0}}.",
       "line": 21,
       "also": [
        20,
        7
       ],
       "prints": [
        "0.0"
       ]
      },
      {
       "text": "In the middle, line 20 sets it to 50, and line 21 prints {{50.0}}.",
       "line": 21,
       "also": [
        20
       ],
       "prints": [
        "50.0"
       ]
      },
      {
       "text": "At the end, line 20 sets it to 100, and line 21 prints {{100.0}}.",
       "line": 21,
       "also": [
        20
       ],
       "prints": [
        "100.0"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "Each value set through `animatableData` became the bar's width, so the path grew a little with each frame."
     }
    }
   }
  },
  "animation-curve": {
   "id": "animation-curve",
   "name": "Animation curve",
   "first": "The curve that an animation follows, which maps each moment of its duration to how far along the change is, from 0 to 1.",
   "parts": []
  },
  "animation": {
   "id": "animation",
   "name": "Animation",
   "area": "ui",
   "first": "SwiftUI changing what a view shows smoothly over time, from its old values to its new ones, after a change of state.",
   "parts": [
    "with-animation",
    "animation-curve"
   ],
   "dependsOn": [
    {
     "id": "view-update",
     "views": [
      "what",
      "parts"
     ],
     "why": "An animated change is a change of state, which runs the body once with the new values, as any other change does.",
     "whyInExample": "The property `moved` is state that the `body` of `Mover` read, as `taps` is on the page of View update."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "let curve = UnitCurve.easeInOut",
     "let move = Animation",
     "    .timingCurve(curve, duration: 1)",
     "",
     "struct Mover: View {",
     "    @State private var moved = false",
     "    var body: some View {",
     "        let _ = print(\"body runs:\", moved)",
     "        Color.blue",
     "            .offset(x: moved ? 100 : 0)",
     "            .onAppear {",
     "                withAnimation(move) {",
     "                    moved = true",
     "                }",
     "            }",
     "    }",
     "}",
     "",
     "_ = ImageRenderer(content: Mover()).cgImage",
     "for time in [0.0, 0.25, 0.5, 0.75, 1.0] {",
     "    let done = curve.value(at: time)",
     "    print(time, (done * 100).rounded())",
     "}"
    ]
   },
   "views": {
    "what": {
     "is": "An animation is SwiftUI changing what a view shows smoothly over time, from its old values to its new ones, after a change of state. A change made inside `withAnimation` is animated. SwiftUI runs `body` once with the new values, and then moves what it draws from the old values to the new ones, over the animation's duration, along its curve.",
     "marks": [
      {
       "line": 14,
       "text": "withAnimation(move)",
       "part": "with-animation",
       "label": "animates the change"
      },
      {
       "line": 5,
       "text": "timingCurve(curve, duration: 1)",
       "part": "animation-curve",
       "label": "how it moves"
      }
     ],
     "afterExample": "When `Mover` appears, line 15 moves it 100 points to the right, inside `withAnimation`. The `body` runs only once more. In an app, the color would then slide over one second, and lines 22 to 25 print where the curve puts it at each quarter of that second.",
     "problem": "A view that moves to a new place or size at once is hard to follow: the user does not see what changed. An animation shows the change happening, so the user sees where a view went.",
     "how": "Apple's documentation says that `withAnimation` sets its animation on the current transaction, the set of changes that SwiftUI makes in one update. SwiftUI animates each value that changed in that update, such as an offset, from its old value to its new one. The curve maps each moment of the duration to how far along the change is.",
     "when": [
      {
       "text": "Use it for changes the user should see happen, such as a card that moves, grows, or fades when it is chosen."
      },
      {
       "text": "Don't animate every change. A screen whose views all move each time its data loads hides what changed."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "with-animation",
       "name": "The call `withAnimation(move)`, lines 14 to 16",
       "text": "The function `withAnimation` runs its closure, and animates the changes that the closure makes, here `moved` becoming true, with the animation `move`."
      },
      {
       "part": "animation-curve",
       "name": "The curve, lines 3 to 5",
       "text": "The animation `move` lasts 1 second and follows the curve `.easeInOut`, which starts slowly, goes fastest in the middle, and ends slowly. The method `value(at:)` gives how far along the change is at a moment, from 0 to 1."
      }
     ],
     "marks": [
      {
       "line": 14,
       "text": "withAnimation(move)",
       "part": "with-animation",
       "label": "animated change"
      },
      {
       "line": 3,
       "text": "UnitCurve.easeInOut",
       "part": "animation-curve",
       "label": "curve"
      },
      {
       "line": 5,
       "text": "timingCurve(curve, duration: 1)",
       "part": "animation-curve",
       "label": "animation"
      }
     ],
     "steps": [
      {
       "text": "Line 3 gets the ease-in-out curve, and lines 4 and 5 make an animation of 1 second that follows it.",
       "line": 4,
       "also": [
        3,
        5
       ]
      },
      {
       "text": "Line 21 draws a `Mover`. Its `body` runs, and line 10 prints {{body runs: false}}. The offset is 0.",
       "line": 10,
       "also": [
        21,
        12
       ],
       "prints": [
        "body runs: false"
       ]
      },
      {
       "text": "The color appears, and line 14 calls `withAnimation`. Its closure sets `moved` to true, with the animation `move`.",
       "line": 14,
       "also": [
        15
       ]
      },
      {
       "text": "The `body` read `moved`, so it runs once more, and line 10 prints {{body runs: true}}. The offset is now 100. The `body` does not run again for the moments in between.",
       "line": 10,
       "also": [
        12
       ],
       "prints": [
        "body runs: true"
       ]
      },
      {
       "text": "Lines 22 to 25 ask the curve how far along the change is at each quarter of the second, and print where the color is then, in points: {{0.0 0.0}}, {{0.25 13.0}}, {{0.5 50.0}}, {{0.75 87.0}}, and {{1.0 100.0}}. It moves slowly at first, fastest in the middle, and slowly at the end.",
       "line": 24,
       "also": [
        22,
        23
       ],
       "prints": [
        "0.0 0.0",
        "0.25 13.0",
        "0.5 50.0",
        "0.75 87.0",
        "1.0 100.0"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "SwiftUI ran `body` once with the new offset. The animation's curve says where the color is at each moment between the old offset and the new one."
     }
    }
   }
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
  "app-storage-property": {
   "id": "app-storage-property",
   "name": "App storage property",
   "first": "A property of a view marked with the AppStorage attribute and a key, which reads and writes the value under that key in user defaults, and updates the view when it changes.",
   "parts": []
  },
  "app-storage": {
   "id": "app-storage",
   "name": "App storage",
   "area": "ui",
   "first": "A property wrapper that keeps a small value in the app's user defaults, so that it is still there after the app quits, and updates the view when it changes.",
   "parts": [
    "app-storage-property",
    "storage-key"
   ],
   "dependsOn": [
    {
     "id": "state",
     "views": [
      "what",
      "parts"
     ],
     "why": "App storage works as state does in a view, and keeps its value in user defaults in place of SwiftUI's storage.",
     "whyInExample": "The attribute `@AppStorage(\"nights\")` makes `nights` change the view, as `@State` makes `taps` change `Counter`."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "let suite = \"Example.Trips\"",
     "let store = UserDefaults(suiteName: suite)!",
     "store.removeObject(forKey: \"nights\")",
     "",
     "struct Settings: View {",
     "    @AppStorage(\"nights\") var nights = 3",
     "    var body: some View {",
     "        let _ = print(\"nights:\", nights)",
     "        Text(\"\\(nights)\")",
     "            .onAppear { nights = 5 }",
     "    }",
     "}",
     "",
     "let screen = Settings().defaultAppStorage(store)",
     "_ = ImageRenderer(content: screen).cgImage",
     "print(store.integer(forKey: \"nights\"))",
     "let again = Settings().defaultAppStorage(store)",
     "_ = ImageRenderer(content: again).cgImage"
    ]
   },
   "views": {
    "what": {
     "is": "A property marked `@AppStorage` keeps its value in user defaults, the small store of settings that the system keeps for each app on the device, under a key. Apple's documentation says that it reflects a value from user defaults, and updates the view when that value changes. Its value is still there after the app quits.",
     "marks": [
      {
       "line": 8,
       "text": "@AppStorage(\"nights\") var nights = 3",
       "part": "app-storage-property",
       "label": "kept in user defaults"
      }
     ],
     "afterExample": "The view `Settings` keeps `nights` in user defaults, under the key nights. Setting it to 5 writes 5 there, as line 18 shows, so a second `Settings`, made on line 19, starts at 5, as the screen would after the app starts again.",
     "problem": "Some values must outlive the app, such as the number of nights a user usually plans, or whether reminders are on. State is gone when the view goes away. App storage keeps the value in user defaults, which the system saves to the device.",
     "how": "Reading the property reads the value under its key in user defaults, or its first value, 3, when there is none. Writing it writes to user defaults, and runs the `body` again. Apple's documentation says that a view uses the standard user defaults unless `defaultAppStorage` gives it another store, as line 16 does here so the example has a store of its own.",
     "when": [
      {
       "text": "Use it for small settings of the user, such as a number, a choice, or whether something is on."
      },
      {
       "text": "Don't keep private data in it, such as a password. Apple's documentation says that user defaults are stored on disk unencrypted, and that private data belongs in the keychain. Don't keep the app's data there either, such as trips: a SwiftData model saves those."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "app-storage-property",
       "name": "The property `nights`, line 8",
       "text": "The attribute `@AppStorage` makes `nights` a wrapped property of `AppStorage`, a property wrapper that SwiftUI provides. Its first value, 3, is used while user defaults has nothing under its key."
      },
      {
       "part": "storage-key",
       "name": "The key, line 8",
       "text": "The string in the parentheses, nights, is the key that the value is kept under in user defaults. Line 18 reads the same key straight from the store."
      }
     ],
     "marks": [
      {
       "line": 8,
       "text": "@AppStorage(\"nights\") var nights = 3",
       "part": "app-storage-property",
       "label": "app storage"
      },
      {
       "line": 8,
       "text": "\"nights\"",
       "part": "storage-key",
       "label": "key"
      }
     ],
     "steps": [
      {
       "text": "Lines 3 and 4 open a store of user defaults of the example's own, and line 5 removes the key nights from it, so every run starts the same.",
       "line": 4,
       "also": [
        3,
        5
       ]
      },
      {
       "text": "Line 16 makes a `Settings` that uses that store, and line 17 draws it. The store has nothing under nights, so `nights` is 3, and line 10 prints {{nights: 3}}.",
       "line": 10,
       "also": [
        16,
        17,
        8
       ],
       "prints": [
        "nights: 3"
       ]
      },
      {
       "text": "The `Text` appears, and line 12 sets `nights` to 5, which writes 5 under the key nights. The `body` runs again, and line 10 prints {{nights: 5}}.",
       "line": 10,
       "also": [
        12
       ],
       "prints": [
        "nights: 5"
       ]
      },
      {
       "text": "Line 18 reads the key from the store: {{5}}.",
       "line": 18,
       "prints": [
        "5"
       ]
      },
      {
       "text": "Line 19 makes a new `Settings`, and line 20 draws it. The store has 5 under nights, so line 10 prints {{nights: 5}}, and setting 5 again on line 12 changes nothing.",
       "line": 10,
       "also": [
        19,
        20,
        12
       ],
       "prints": [
        "nights: 5"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The value of `nights` went into user defaults, so a new view, as after a restart of the app, started from it."
     }
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
  "bindable-property": {
   "id": "bindable-property",
   "name": "Bindable property",
   "first": "A property of a view marked with the Bindable attribute, which holds an observable class, and whose projected value makes bindings to that class's properties.",
   "parts": []
  },
  "bindable": {
   "id": "bindable",
   "name": "Bindable",
   "area": "ui",
   "first": "A property wrapper for a view's property that holds an observable class, which makes a binding to any property of that class.",
   "parts": [
    "bindable-property",
    "dollar-sign",
    "member-binding"
   ],
   "dependsOn": [
    {
     "id": "observable",
     "views": [
      "what",
      "parts"
     ],
     "why": "A bindable property holds an observable class, and its bindings read and write that class's properties.",
     "whyInExample": "The class `Trip` is observable, as `Trip` is on the page of Observable."
    },
    {
     "id": "binding",
     "views": [
      "what",
      "parts"
     ],
     "why": "A bindable property makes bindings, which a view passes to another view that changes the value.",
     "whyInExample": "The property `count` in `Adder` is a binding, as `nights` in `NightsEditor` is on the page of Binding."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "@Observable",
     "class Trip {",
     "    var nights = 3",
     "}",
     "",
     "struct Adder: View {",
     "    @Binding var count: Int",
     "    var body: some View {",
     "        Text(\"\\(count)\")",
     "            .onAppear { count += 1 }",
     "    }",
     "}",
     "",
     "struct TripEditor: View {",
     "    @Bindable var trip: Trip",
     "    var body: some View {",
     "        Adder(count: $trip.nights)",
     "    }",
     "}",
     "",
     "let trip = Trip()",
     "let editor = TripEditor(trip: trip)",
     "let renderer = ImageRenderer(content: editor)",
     "_ = renderer.cgImage",
     "print(trip.nights)"
    ]
   },
   "views": {
    "what": {
     "is": "A bindable property is a property of a view marked `@Bindable`, which holds an observable class. A dollar sign before it and a property's name after it, as `$trip.nights`, make a binding to that property of the object.",
     "marks": [
      {
       "line": 17,
       "text": "@Bindable var trip: Trip",
       "part": "bindable-property",
       "label": "bindable"
      },
      {
       "line": 19,
       "text": "$trip.nights",
       "label": "a binding to nights"
      }
     ],
     "afterExample": "The view `Adder` changes a number through a binding. The view `TripEditor` gives it a binding to `nights` of the trip, so when `Adder` adds 1, the trip's `nights` becomes 4, as line 27 prints.",
     "problem": "Controls and editors take a binding for the value they change. A state property gives a binding with a dollar sign, but a view that is given an observable class holds it in a plain property, which gives no binding. A bindable property gives a binding to each property of the class.",
     "how": "The type `Bindable` is a property wrapper that SwiftUI provides. Its projected value, read with `$trip`, makes a binding for the property named after it. Reading that binding reads `nights` of the trip, and writing it sets `nights`, which the observable class reports as any other change.",
     "when": [
      {
       "text": "Use it in a view that is given an observable class and must pass a binding to one of its properties, such as to an editor or a control."
      },
      {
       "text": "Don't use it in a view that only reads the object. A plain property is enough there, because reading the object's properties needs no binding."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "bindable-property",
       "name": "The bindable property `trip`, line 17",
       "text": "The attribute `@Bindable` makes `trip` a wrapped property of `Bindable`, a property wrapper that SwiftUI provides. Its wrapped value is the `Trip` that line 24 passes in."
      },
      {
       "part": "dollar-sign",
       "name": "The dollar sign, in `$trip`, line 19",
       "text": "A dollar sign before `trip` reads the projected value of `Bindable`, which can make a binding to each property of the trip."
      },
      {
       "part": "member-binding",
       "name": "The property `nights`, after `$trip`, line 19",
       "text": "The name `nights` after `$trip` makes a binding to `nights` of the trip. Line 19 passes it to `count` of `Adder`."
      }
     ],
     "marks": [
      {
       "line": 17,
       "text": "@Bindable var trip: Trip",
       "part": "bindable-property",
       "label": "bindable"
      },
      {
       "line": 19,
       "text": "$",
       "part": "dollar-sign",
       "label": "projected value"
      },
      {
       "line": 19,
       "text": ".nights",
       "part": "member-binding",
       "label": "binding to nights"
      }
     ],
     "steps": [
      {
       "text": "Line 23 makes a `Trip`, whose `nights` is 3. Line 24 makes a `TripEditor` with it, and line 25 makes a renderer.",
       "line": 23,
       "also": [
        24,
        25
       ]
      },
      {
       "text": "Line 26 asks for the image, so SwiftUI runs the `body` of `TripEditor`. Line 19 makes a binding to `nights` of the trip, and gives it to an `Adder`.",
       "line": 19,
       "also": [
        26
       ]
      },
      {
       "text": "The `Text` of `Adder` appears, so SwiftUI calls the closure of `onAppear`, which adds 1 to `count`. Writing the binding sets `nights` of the trip to 4.",
       "line": 12,
       "also": [
        9
       ]
      },
      {
       "text": "Line 27 prints `nights` of the trip: {{4}}.",
       "line": 27,
       "prints": [
        "4"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The binding that `$trip.nights` made wrote to the trip itself, so the trip's `nights` changed."
     }
    }
   }
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
  "button-style": {
   "id": "button-style",
   "name": "Button style",
   "area": "ui",
   "first": "A type of your own that draws each button it is applied to, both at rest and while it is pressed, while the button keeps its own action.",
   "parts": [
    "conformance",
    "style-body",
    "style-configuration"
   ],
   "dependsOn": [
    {
     "id": "control",
     "views": [
      "what",
      "parts"
     ],
     "why": "A button style draws buttons, which are controls with a label and an action.",
     "whyInExample": "The call `Button(\"Save\") {}` makes a button with a label and an action, as the Save button is on the page of Control."
    },
    {
     "id": "protocol",
     "views": [
      "what",
      "parts"
     ],
     "why": "A button style is a type that conforms to SwiftUI's button style protocol, which requires one method.",
     "whyInExample": "The type `Pill` conforms to `ButtonStyle` by having `makeBody(configuration:)`, as `Friendly` conforms to `Greeter` by having `greet(name:)`."
    },
    {
     "id": "view-modifier",
     "views": [
      "parts"
     ],
     "why": "The style draws the button's label with modifiers.",
     "whyInExample": "The calls `padding(8)` and `opacity` are modifiers of the label, as `padding(8)` and `opacity(0.5)` are on the page of View modifier."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Pill: ButtonStyle {",
     "    func makeBody(",
     "        configuration: Configuration",
     "    ) -> some View {",
     "        let pressed = configuration.isPressed",
     "        let _ = print(\"pressed:\", pressed)",
     "        configuration.label",
     "            .padding(8)",
     "            .background(Color.yellow)",
     "            .opacity(pressed ? 0.5 : 1)",
     "    }",
     "}",
     "",
     "let save = Button(\"Save\") {}",
     "    .buttonStyle(Pill())",
     "_ = ImageRenderer(content: save).cgImage"
    ]
   },
   "views": {
    "what": {
     "is": "A button style is a type that conforms to the protocol `ButtonStyle`. Its method `makeBody(configuration:)` gets a button's label and whether the button is pressed, and returns the view that the button is drawn as. Apple's documentation says that a button with a style still has the platform's standard behavior for a button, such as when its action runs.",
     "marks": [
      {
       "line": 3,
       "text": "ButtonStyle",
       "part": "conformance",
       "label": "a button style"
      },
      {
       "line": 4,
       "text": "makeBody",
       "part": "style-body",
       "label": "draws the button"
      },
      {
       "line": 17,
       "text": "buttonStyle(Pill())",
       "label": "uses the style"
      }
     ],
     "afterExample": "The style `Pill` draws a button as its label, with space around it, on yellow, and at half opacity while it is pressed. Line 17 gives the Save button that style.",
     "problem": "An app often wants its own look for buttons, the same on every screen. Building that look into every button repeats it, and loses the platform's behavior for presses. A button style is written once, and every button that uses it gets the look and keeps its behavior.",
     "how": "Apple's documentation says that the modifier `buttonStyle` sets the style for the buttons in a view and the views inside it. For each button, SwiftUI calls `makeBody(configuration:)` with a configuration: its `label`, and `isPressed`, which is true while the user presses the button. The style decides how each one looks.",
     "when": [
      {
       "text": "Use it for the look of buttons across an app, such as a pill shape, so that every button looks and behaves the same."
      },
      {
       "text": "Don't use it to change what a button does when tapped. Its action is the button's own, and a button style only draws it."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "conformance",
       "name": "The conformance to `ButtonStyle`, line 3",
       "text": "The colon and the name `ButtonStyle` after `Pill` say that `Pill` conforms to the protocol `ButtonStyle`, whose one requirement is the method `makeBody(configuration:)`."
      },
      {
       "part": "style-body",
       "name": "The method `makeBody`, lines 4 to 13",
       "text": "The method returns the view that the button is drawn as. Here it is the label with 8 points of padding, a yellow background, and an opacity of 0.5 while pressed and 1 otherwise."
      },
      {
       "part": "style-configuration",
       "name": "The configuration, line 5",
       "text": "The parameter `configuration` describes one button: its `label`, the view that says what it does, and `isPressed`, which is true while the user presses it."
      }
     ],
     "marks": [
      {
       "line": 3,
       "text": "ButtonStyle",
       "part": "conformance",
       "label": "conformance"
      },
      {
       "line": 4,
       "text": "makeBody",
       "part": "style-body",
       "label": "draws the button"
      },
      {
       "line": 5,
       "text": "configuration: Configuration",
       "part": "style-configuration",
       "label": "the button"
      }
     ],
     "steps": [
      {
       "text": "Line 16 makes a button, Save, with an empty action, and line 17 gives it the style `Pill`.",
       "line": 16,
       "also": [
        17
       ]
      },
      {
       "text": "Line 18 draws the button. SwiftUI calls `makeBody(configuration:)` of `Pill`, with the configuration of this button.",
       "line": 18,
       "also": [
        4,
        5
       ]
      },
      {
       "text": "No one presses the button, so line 7 reads false from `isPressed`, and line 8 prints {{pressed: false}}.",
       "line": 8,
       "also": [
        7
       ],
       "prints": [
        "pressed: false"
       ]
      },
      {
       "text": "Lines 9 to 12 return the label, Save, with padding, a yellow background, and an opacity of 1. While the user pressed it, `isPressed` would be true, and the button would be drawn at half opacity.",
       "line": 12,
       "also": [
        9,
        10,
        11
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The style drew the button from its label and from whether it was pressed. The button kept its own action."
     }
    }
   }
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
  "canvas-closure": {
   "id": "canvas-closure",
   "name": "Drawing closure",
   "first": "The closure of a canvas, which SwiftUI calls each time it draws the canvas, with a graphics context to draw in and the size of the canvas.",
   "parts": []
  },
  "canvas": {
   "id": "canvas",
   "name": "Canvas",
   "area": "ui",
   "first": "A view that draws shapes, images, and text with code, all in one view, in place of a view for each thing it draws.",
   "parts": [
    "canvas-closure",
    "graphics-context"
   ],
   "dependsOn": [
    {
     "id": "path",
     "views": [
      "what",
      "parts"
     ],
     "why": "A canvas draws paths, by filling or stroking them in its context.",
     "whyInExample": "The constant `circle` is a path, as `path` is on the page of Path, and line 10 fills it."
    },
    {
     "id": "layout-process",
     "views": [
      "parts"
     ],
     "why": "A canvas takes the whole size it is proposed in the steps of layout, and draws in that size.",
     "whyInExample": "The renderer proposes 200 by 10 to `dots`, as `filler` proposes 300 by 200 to a color on the page of Layout process."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "let dots = Canvas { context, size in",
     "    print(\"size\", size.width, size.height)",
     "    let dot = CGSize(width: 10, height: 10)",
     "    for n in 0..<4 {",
     "        let spot = CGPoint(x: n * 50, y: 0)",
     "        let box = CGRect(origin: spot, size: dot)",
     "        let circle = Path(ellipseIn: box)",
     "        context.fill(circle, with: .color(.blue))",
     "        print(\"dot at\", n * 50)",
     "    }",
     "}",
     "let size = CGSize(width: 200, height: 10)",
     "let renderer = ImageRenderer(content: dots)",
     "renderer.proposedSize = ProposedViewSize(size)",
     "_ = renderer.cgImage"
    ]
   },
   "views": {
    "what": {
     "is": "A `Canvas` is a view that draws with code. It calls its closure with a graphics context, which draws paths, images, and text, and with the size of the canvas. Everything it draws is part of one view, not a view for each thing.",
     "marks": [
      {
       "line": 3,
       "text": "{ context, size in",
       "part": "canvas-closure",
       "label": "draws with code"
      },
      {
       "line": 10,
       "text": "context.fill(circle, with: .color(.blue))",
       "part": "graphics-context",
       "label": "draws a circle"
      }
     ],
     "afterExample": "The canvas draws a row of four blue circles, one every 50 points, in the size it was given, 200 by 10. It is one view, with no view for each circle.",
     "problem": "A drawing of many small pieces, such as the dots of a chart or the stars of a sky, would need a view for each piece, and SwiftUI does work for every view. A canvas draws all the pieces with code inside one view.",
     "how": "Apple's documentation says that a canvas passes a graphics context to its closure, for drawing, and a size, for fitting the drawing. It also says that a canvas offers no taps and no accessibility for the pieces it draws, and can be faster for a complex drawing.",
     "when": [
      {
       "text": "Use a canvas for a drawing of many pieces that the user does not tap one by one, such as a chart, a pattern, or a graph."
      },
      {
       "text": "Don't use a canvas for pieces that the user taps, or that VoiceOver must read, such as buttons. Views give each piece taps and accessibility, and a canvas does not."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "canvas-closure",
       "name": "The closure, lines 3 to 13",
       "text": "The closure draws the canvas. Its parameter `size` is the size of the canvas, so the drawing can fit it, and its parameter `context` is the graphics context it draws in. SwiftUI calls it each time the canvas is drawn."
      },
      {
       "part": "graphics-context",
       "name": "The graphics context `context`, line 10",
       "text": "A graphics context has methods that draw, such as `fill(_:with:)`, which fills a path with a color. Each call draws on the canvas, on top of what was drawn before it."
      }
     ],
     "marks": [
      {
       "line": 3,
       "text": "{ context, size in",
       "part": "canvas-closure",
       "label": "closure"
      },
      {
       "line": 10,
       "text": "context.fill(circle, with: .color(.blue))",
       "part": "graphics-context",
       "label": "context"
      }
     ],
     "steps": [
      {
       "text": "Line 3 makes a `Canvas`, with the closure that draws it. Nothing is drawn yet.",
       "line": 3
      },
      {
       "text": "Lines 14 to 16 make a renderer that proposes 200 by 10, and line 17 draws. The canvas takes the size proposed, and calls its closure with a context and that size. Line 4 prints {{size 200.0 10.0}}.",
       "line": 4,
       "also": [
        14,
        15,
        16,
        17
       ],
       "prints": [
        "size 200.0 10.0"
       ]
      },
      {
       "text": "The loop on line 6 runs 4 times. Each time, lines 7 to 9 make a circle 10 points wide, 50 points further right than the last, and line 10 fills it blue. Line 11 prints {{dot at 0}}, {{dot at 50}}, {{dot at 100}}, and {{dot at 150}}.",
       "line": 11,
       "also": [
        6,
        7,
        8,
        9,
        10
       ],
       "prints": [
        "dot at 0",
        "dot at 50",
        "dot at 100",
        "dot at 150"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The canvas drew four circles with code, inside one view, in the size it got."
     }
    }
   }
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
  "class-keyword": {
   "id": "class-keyword",
   "name": "class",
   "first": "The keyword that declares a class. The class's name comes right after it.",
   "parts": []
  },
  "class": {
   "id": "class",
   "name": "Class",
   "area": "swift",
   "first": "A type whose instances are heap objects, so that assigning an instance copies only its address, and every copy refers to the same instance.",
   "parts": [
    "class-keyword",
    "stored-property",
    "reference",
    "identity-operator"
   ],
   "dependsOn": [
    {
     "id": "structure",
     "views": [
      "what",
      "parts"
     ],
     "why": "A class groups values under one name, as a structure does, and differs in what assigning an instance copies.",
     "whyInExample": "The class `Counter` groups one value, `count`, as `Trip` on the page of Structure groups `city` and `nights`."
    },
    {
     "id": "heap-object",
     "views": [
      "what",
      "parts"
     ],
     "why": "Each instance of a class is a heap object, and a constant or variable of the class holds its address.",
     "whyInExample": "The call `Counter()` makes a heap object, as `Score()` does on the page of Heap object."
    }
   ],
   "example": {
    "code": [
     "class Counter {",
     "    var count = 0",
     "}",
     "",
     "let first = Counter()",
     "let second = first",
     "second.count = 5",
     "print(first.count)",
     "print(first === second)"
    ],
    "sil": [
     {
      "in": "Counter.__allocating_init()",
      "has": "alloc_ref $Counter",
      "shows": "Line 5 calls the initializer of Counter, which makes the instance with alloc_ref, which takes memory on the heap."
     }
    ]
   },
   "views": {
    "what": {
     "is": "A class is a type that groups values under one name, as a structure does. Each instance of a class is a heap object. A constant or variable of the class holds a reference to the instance, which is its address, so assigning the instance to another constant copies only the reference, and both refer to the same instance.",
     "marks": [
      {
       "line": 1,
       "text": "class",
       "part": "class-keyword",
       "label": "a class"
      },
      {
       "line": 6,
       "text": "first",
       "part": "reference",
       "label": "copies the reference"
      }
     ],
     "afterExample": "Line 6 copies the reference in `first` into `second`, so both refer to one `Counter`. When line 7 sets `count` through `second`, `first` sees 5 as well.",
     "problem": "Some data must be shared, so that a change made in one place is seen everywhere that uses it, such as the list of trips that several screens show. A structure is copied each time it is assigned, so each screen would change its own copy. Every reference to an instance of a class reaches the same instance.",
     "how": "Calling a class's initializer makes the instance on the heap and returns its address. Assigning or passing the instance copies that address. Swift counts the references to each instance, and frees the instance's memory when no reference is left.",
     "when": [
      {
       "text": "Use a class for data that several parts of a program must share and change, such as a store of trips that several screens show."
      },
      {
       "text": "Don't use a class for a small group of values that should be copied, such as the details of one trip. A structure is simpler, and a copy can never change another copy."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "class-keyword",
       "name": "The keyword `class`, line 1",
       "text": "The keyword `class` declares a class. Its name, `Counter`, comes right after it, and its stored properties are between the braces on lines 1 and 3."
      },
      {
       "part": "stored-property",
       "name": "The stored property `count`, line 2",
       "text": "Every instance of `Counter` holds its own value of `count`, which starts at 0. A class has no memberwise initializer, so a stored property needs a first value, or an initializer of the class's own that sets it."
      },
      {
       "part": "reference",
       "name": "The reference in `first`, line 6",
       "text": "The constants `first` and `second` hold references, the address of an instance on the heap, not the instance. Line 6 copies the reference in `first`, so `second` refers to the same instance."
      },
      {
       "part": "identity-operator",
       "name": "The identity operator, line 9",
       "text": "Three equal signs compare two references. The result is true when both refer to the same instance, even if another instance has equal values."
      }
     ],
     "marks": [
      {
       "line": 1,
       "text": "class",
       "part": "class-keyword",
       "label": "keyword"
      },
      {
       "line": 2,
       "text": "var count = 0",
       "part": "stored-property",
       "label": "stored property"
      },
      {
       "line": 6,
       "text": "first",
       "part": "reference",
       "label": "a reference"
      },
      {
       "line": 9,
       "text": "===",
       "part": "identity-operator",
       "label": "same instance?"
      }
     ],
     "steps": [
      {
       "text": "Line 5 calls the initializer of `Counter`. It makes an instance on the heap whose `count` is 0, and `first` holds a reference to it.",
       "line": 5,
       "also": [
        2
       ]
      },
      {
       "text": "Line 6 copies the reference in `first` into `second`. There is still one instance.",
       "line": 6
      },
      {
       "text": "Line 7 sets `count` of the instance that `second` refers to, to 5. It is the instance that `first` refers to, so `first.count` is 5 too.",
       "line": 7,
       "value": {
        "line": 7,
        "name": "first.count",
        "is": "5"
       }
      },
      {
       "text": "Line 8 prints `count` through `first`: {{5}}.",
       "line": 8,
       "prints": [
        "5"
       ]
      },
      {
       "text": "Line 9 checks whether `first` and `second` refer to the same instance. They do, so it prints {{true}}.",
       "line": 9,
       "prints": [
        "true"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "Line 6 copied a reference, not the instance, so the change made through `second` is seen through `first`."
     }
    }
   }
  },
  "close-subpath": {
   "id": "close-subpath",
   "name": "Closing an outline",
   "first": "A line that a path adds from its current point back to where its outline started, so that the outline has an inside.",
   "parts": []
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
  "color-scheme-property": {
   "id": "color-scheme-property",
   "name": "Color scheme value",
   "first": "The environment value that says whether a view is shown in light mode or in dark mode.",
   "parts": []
  },
  "color-scheme": {
   "id": "color-scheme",
   "name": "Color scheme",
   "area": "ui",
   "first": "Whether views are shown in light mode or dark mode, which a view reads from the environment, and which the system's colors follow on their own.",
   "parts": [
    "color-scheme-property",
    "adaptive-color"
   ],
   "dependsOn": [
    {
     "id": "environment",
     "views": [
      "what",
      "parts"
     ],
     "why": "SwiftUI sets the color scheme in the environment, where a view reads it, and where a color is resolved.",
     "whyInExample": "The property `@Environment(\\.colorScheme)` reads the scheme, as `@Environment(\\.isEnabled)` reads whether views are enabled."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Badge: View {",
     "    @Environment(\\.colorScheme) var scheme",
     "    var body: some View {",
     "        let _ = print(\"scheme:\", scheme)",
     "        Text(\"Lima\")",
     "    }",
     "}",
     "",
     "for scheme in [ColorScheme.light, .dark] {",
     "    let badge = Badge()",
     "        .environment(\\.colorScheme, scheme)",
     "    _ = ImageRenderer(content: badge).cgImage",
     "    var values = EnvironmentValues()",
     "    values.colorScheme = scheme",
     "    print(Color.primary.resolve(in: values))",
     "}"
    ]
   },
   "views": {
    "what": {
     "is": "The color scheme says whether views are shown in light mode or in dark mode. SwiftUI sets it in the environment from the user's choice in Settings, and a view reads it with `@Environment(\\.colorScheme)`. The system's colors, such as `Color.primary`, follow it on their own: they are a different color in each mode.",
     "marks": [
      {
       "line": 4,
       "text": "@Environment(\\.colorScheme) var scheme",
       "part": "color-scheme-property",
       "label": "light or dark"
      },
      {
       "line": 17,
       "text": "Color.primary",
       "part": "adaptive-color",
       "label": "follows the mode"
      }
     ],
     "afterExample": "The view `Badge` reads the scheme, and the loop draws it once in light mode and once in dark mode. The primary color is black, nearly opaque, in light mode, and white in dark mode.",
     "problem": "Users choose light or dark mode, and an app must be readable in both: dark text on a dark background disappears. System colors change with the mode by themselves, and a view can read the mode for anything else, such as a picture that has a dark version.",
     "how": "Apple's documentation says that the value a view reads depends on whether the user turned on Dark Mode, and on the presentation it is in. A system color, or a color from the asset catalog with a dark version, is a color for each mode: SwiftUI resolves it to one value with the environment it is drawn in.",
     "when": [
      {
       "text": "Use system colors and colors with a dark version for text and backgrounds, so that they follow the mode with no code. Read the scheme only for what colors cannot do, such as a different picture."
      },
      {
       "text": "Don't set the color scheme in the environment to force a mode. Apple's documentation says that this changes the views below, but not the presentation around them, and suggests a modifier for the preferred color scheme in its place."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "color-scheme-property",
       "name": "The color scheme `scheme`, line 4",
       "text": "The property reads the color scheme from the environment, which is `.light` or `.dark`. Here lines 12 and 13 set it for each `Badge`, as the system would from the user's setting."
      },
      {
       "part": "adaptive-color",
       "name": "The color `Color.primary`, line 17",
       "text": "The primary color is the color of the main text. It has one value for each mode, and `resolve(in:)` gives its value in the environment it is given, here `values`, whose color scheme lines 15 and 16 set."
      }
     ],
     "marks": [
      {
       "line": 4,
       "text": "@Environment(\\.colorScheme) var scheme",
       "part": "color-scheme-property",
       "label": "color scheme"
      },
      {
       "line": 17,
       "text": "Color.primary",
       "part": "adaptive-color",
       "label": "system color"
      }
     ],
     "steps": [
      {
       "text": "The loop on line 11 runs first with `.light`. Lines 12 to 14 draw a `Badge` whose color scheme is light, and line 6 prints {{scheme: light}}.",
       "line": 6,
       "also": [
        11,
        12,
        13,
        14
       ],
       "prints": [
        "scheme: light"
       ]
      },
      {
       "text": "Lines 15 and 16 make environment values whose color scheme is light, and line 17 resolves the primary color in them: black, with an opacity of D8 out of FF: {{#000000D8}}.",
       "line": 17,
       "also": [
        15,
        16
       ],
       "prints": [
        "#000000D8"
       ]
      },
      {
       "text": "The loop runs again with `.dark`. The `Badge` reads the dark scheme, and line 6 prints {{scheme: dark}}.",
       "line": 6,
       "also": [
        11,
        13
       ],
       "prints": [
        "scheme: dark"
       ]
      },
      {
       "text": "In dark mode, the primary color resolves to white: {{#FFFFFFD8}}.",
       "line": 17,
       "prints": [
        "#FFFFFFD8"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The view read light or dark from its environment, and the same system color became black in light mode and white in dark mode."
     }
    }
   }
  },
  "compact-size-class": {
   "id": "compact-size-class",
   "name": "Compact size class",
   "first": "The size class of a direction in which a window has little room, as across an iPhone held upright.",
   "parts": []
  },
  "conformance": {
   "id": "conformance",
   "name": "Conformance",
   "first": "A type's statement, written as a protocol's name after a colon, that it has everything the protocol requires.",
   "parts": []
  },
  "content-type": {
   "id": "content-type",
   "name": "Content type",
   "first": "The label that says what kind of data some bytes are, such as JSON, plain text, or a picture, so that the side that gets them knows whether it can use them.",
   "parts": []
  },
  "context": {
   "id": "context",
   "name": "Context",
   "first": "A heap object that holds what a closure captured.",
   "parts": []
  },
  "control-action": {
   "id": "control-action",
   "name": "Action of a control",
   "first": "The closure that a button or a menu item is given, which it calls each time the user taps it.",
   "parts": []
  },
  "control-binding": {
   "id": "control-binding",
   "name": "Binding of a control",
   "first": "The binding that a control is given to the value it changes, which it reads to draw itself and writes when the user changes it.",
   "parts": []
  },
  "control-label": {
   "id": "control-label",
   "name": "Label of a control",
   "first": "The text or view that a control shows to say what it does, such as Save on a button.",
   "parts": []
  },
  "control": {
   "id": "control",
   "name": "Control",
   "area": "ui",
   "first": "A view that the user changes or taps, such as a button, a toggle, a picker, or a slider, which reports each change through a binding or by calling a closure.",
   "parts": [
    "control-label",
    "control-binding",
    "control-action"
   ],
   "dependsOn": [
    {
     "id": "binding",
     "views": [
      "what",
      "parts"
     ],
     "why": "A control that changes a value is given a binding to it, and writes the new value through the binding.",
     "whyInExample": "The value `$reminders` is a binding to the state `reminders`, as `$nights` is a binding to `nights` on the page of Binding."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Settings: View {",
     "    @State private var reminders = true",
     "    var body: some View {",
     "        let _ = print(\"reminders:\", reminders)",
     "        Toggle(\"Reminders\", isOn: $reminders)",
     "            .onAppear { reminders.toggle() }",
     "        Button(\"Save\") { print(\"saved\") }",
     "    }",
     "}",
     "_ = ImageRenderer(content: Settings()).cgImage"
    ]
   },
   "views": {
    "what": {
     "is": "A control is a view that the user changes or taps, such as a button, a toggle, a picker, a slider, or a menu. A control that changes a value, such as a `Toggle`, is given a binding to the value, and writes each new value through it. A `Button` is given a closure, which it calls each time the user taps it.",
     "marks": [
      {
       "line": 7,
       "text": "isOn: $reminders",
       "part": "control-binding",
       "label": "writes the value"
      },
      {
       "line": 9,
       "text": "{ print(\"saved\") }",
       "part": "control-action",
       "label": "runs when tapped"
      }
     ],
     "afterExample": "The toggle shows whether reminders are on, and writes the new value to `reminders` when the user flips it. No one taps anything here, so line 8 changes the value, as the toggle would, and the `body` runs again. No one taps Save, so its closure never runs.",
     "problem": "Every app takes input: a setting turned on, a choice from a list, a number of nights, a tap on Save. Controls are views that SwiftUI draws in the style of each platform, and each one gives the code what the user did.",
     "how": "Apple's documentation says that a toggle is made with a binding and a label, and a button with an action and a label. A control that changes a value reads the value through its binding to draw itself, and writes the new value through the binding when the user changes it. The value is usually state, so the `body` that read it runs again.",
     "when": [
      {
       "text": "Use SwiftUI's controls for input: a `Toggle` for on or off, a `Button` for an action, and a picker, a slider, or a stepper for a choice or a number."
      },
      {
       "text": "Don't make a control from a text that reacts to taps. A `Button` already has the platform's look, and VoiceOver reads it as a button."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "control-label",
       "name": "The labels, lines 7 and 9",
       "text": "A control's first argument is its label, which says what it does: Reminders for the toggle, and Save for the button. The label can also be any view."
      },
      {
       "part": "control-binding",
       "name": "The binding, line 7",
       "text": "The argument `isOn` gives the toggle a binding to `reminders`. The toggle draws itself on or off from the value, and writes the opposite value when the user flips it."
      },
      {
       "part": "control-action",
       "name": "The action, line 9",
       "text": "The closure after `Button(\"Save\")` is the button's action. The button keeps no value: it calls this closure each time the user taps it."
      }
     ],
     "marks": [
      {
       "line": 7,
       "text": "\"Reminders\"",
       "part": "control-label",
       "label": "label"
      },
      {
       "line": 9,
       "text": "\"Save\"",
       "part": "control-label",
       "label": "label"
      },
      {
       "line": 7,
       "text": "isOn: $reminders",
       "part": "control-binding",
       "label": "binding"
      },
      {
       "line": 9,
       "text": "{ print(\"saved\") }",
       "part": "control-action",
       "label": "action"
      }
     ],
     "steps": [
      {
       "text": "Line 12 makes a `Settings` and draws it. The state `reminders` starts true.",
       "line": 12,
       "also": [
        4
       ]
      },
      {
       "text": "The `body` runs, and line 6 prints {{reminders: true}}. The toggle reads the value through its binding, and is drawn on.",
       "line": 6,
       "also": [
        7
       ],
       "prints": [
        "reminders: true"
       ]
      },
      {
       "text": "The toggle appears, and line 8 flips `reminders` to false, as the toggle does through its binding when the user taps it.",
       "line": 8
      },
      {
       "text": "The `body` read `reminders`, so it runs again, and line 6 prints {{reminders: false}}. The toggle is now drawn off.",
       "line": 6,
       "prints": [
        "reminders: false"
       ]
      },
      {
       "text": "No one taps the button on line 9, so its closure never runs, and the program never prints saved.",
       "line": 9
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The toggle read and wrote `reminders` through its binding, so the change ran the `body` again. The button would only call its closure when tapped."
     }
    }
   }
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
  "detail-column": {
   "id": "detail-column",
   "name": "Detail column",
   "first": "The trailing column of a split view, which shows the item that the user chose in a column before it.",
   "parts": []
  },
  "dollar-sign": {
   "id": "dollar-sign",
   "name": "Dollar sign",
   "first": "The dollar sign written before the name of a wrapped property, which reads the wrapper's projected value in place of its wrapped value.",
   "parts": []
  },
  "drag-and-drop": {
   "id": "drag-and-drop",
   "name": "Drag and drop",
   "area": "ui",
   "first": "Moving a value from one view, or from one app, to another, by dragging it and dropping it, with the value carried as data of a transferable type.",
   "parts": [
    "draggable-modifier",
    "drop-destination"
   ],
   "dependsOn": [
    {
     "id": "transferable",
     "views": [
      "what"
     ],
     "why": "A drag carries a value of a transferable type, as data, and the drop turns the data back into values.",
     "whyInExample": "The constant `city` is a string, which is transferable, as `Trip` is on the page of Transferable."
    },
    {
     "id": "gesture",
     "views": [
      "what"
     ],
     "why": "A drag starts with a touch that the view recognizes, which the drag modifier adds for it.",
     "whyInExample": "The modifier `draggable(city)` adds to the `Text` the gestures for dragging it, as `gesture(drag)` adds a drag on the page of Gesture."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "let city = \"Lima\"",
     "let card = Text(city).draggable(city)",
     "let bin = Color.gray.dropDestination(",
     "    for: String.self",
     ") { cities, _ in",
     "    print(\"dropped\", cities)",
     "    return true",
     "}",
     "let data = try await city.exported(as: .plainText)",
     "print(String(decoding: data, as: UTF8.self))"
    ],
    "output": [
     "Lima"
    ]
   },
   "views": {
    "what": {
     "is": "Drag and drop moves a value from one view to another, or from one app to another. The modifier `draggable` makes a view the start of a drag, carrying a value of a transferable type. The modifier `dropDestination` makes a view a place to drop values of one type, and calls its closure with the values that were dropped.",
     "marks": [
      {
       "line": 4,
       "text": "draggable(city)",
       "part": "draggable-modifier",
       "label": "can be dragged"
      },
      {
       "line": 5,
       "text": "dropDestination(",
       "part": "drop-destination",
       "label": "takes strings"
      }
     ],
     "afterExample": "The card Lima can be dragged, and the gray area takes strings that are dropped on it. A drag carries the string as data: line 11 turns it into plain text, as the drag would, and line 12 prints that data as text: {{Lima}}. A program with no window has no finger to drag, so the closure of the drop never runs.",
     "problem": "Users expect to move things by dragging them, such as a photo into a trip, or a trip into another app. Both sides must agree on what the data is. Drag and drop carries the value as data of a transferable type, so any side that reads that kind of data can take it.",
     "how": "Apple's documentation says that `draggable` adds the gestures for drag and drop to the view, and makes a picture of the view to show under the finger. When the user drops on a view with `dropDestination`, the data is turned back into values of the type it names, here `String`, and its closure gets them, with the point of the drop. The closure returns true when it took the values.",
     "when": [
      {
       "text": "Use it for moving items where people expect it, such as sorting trips, or adding a photo from another app."
      },
      {
       "text": "Don't make dragging the only way to do something. Some users cannot drag, so give a button or a menu as well."
      }
     ]
    }
   }
  },
  "draggable-modifier": {
   "id": "draggable-modifier",
   "name": "Draggable modifier",
   "first": "The modifier that makes a view the start of a drag, carrying a value of a transferable type.",
   "parts": []
  },
  "drop-destination": {
   "id": "drop-destination",
   "name": "Drop destination",
   "first": "The modifier that makes a view a place to drop values of one transferable type, with a closure that gets the dropped values and says whether it took them.",
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
  "dynamic-type": {
   "id": "dynamic-type",
   "name": "Dynamic Type",
   "area": "ui",
   "first": "The text size that a user chooses in Settings, which text in a text style follows, and which a layout must make room for.",
   "parts": [
    "text-style",
    "type-size"
   ],
   "dependsOn": [
    {
     "id": "text",
     "views": [
      "what",
      "parts"
     ],
     "why": "Text in a text style grows and shrinks with the user's text size.",
     "whyInExample": "The view `Text(\"Lima\")` is a text, as `Text(\"Lima\")` is on the page of Text."
    },
    {
     "id": "environment",
     "views": [
      "parts"
     ],
     "why": "SwiftUI sets the text size in the environment, where text reads it.",
     "whyInExample": "The modifier `dynamicTypeSize(size)` sets the size in the environment of the text, as `environment(\\.isEnabled, false)` sets whether views are enabled."
    }
   ],
   "example": {
    "ios": true,
    "code": [
     "import SwiftUI",
     "",
     "let usual = DynamicTypeSize.large",
     "let bigger = DynamicTypeSize.accessibility3",
     "for size in [usual, bigger] {",
     "    let label = Text(\"Lima\")",
     "        .font(.body)",
     "        .dynamicTypeSize(size)",
     "    let renderer = ImageRenderer(content: label)",
     "    print(size, renderer.cgImage!.height)",
     "}"
    ]
   },
   "views": {
    "what": {
     "is": "Dynamic Type is the text size that a user chooses in Settings. Text in a text style, such as `.body`, follows it: it is drawn larger or smaller for each size. Apple's documentation says that the five sizes whose names begin with accessibility are much larger than the rest.",
     "marks": [
      {
       "line": 7,
       "text": ".font(.body)",
       "part": "text-style",
       "label": "follows the size"
      },
      {
       "line": 8,
       "text": "dynamicTypeSize(size)",
       "part": "type-size",
       "label": "the user's size"
      }
     ],
     "afterExample": "The same `Text` is drawn twice in the body style: at the size most people use, and at one of the accessibility sizes. It is 21 pixels tall the first time, and 48 the second. The program runs on an iPhone in the simulator, because text sizes come from iOS.",
     "problem": "People see differently, and many need larger text to read at all. Text that keeps one size is too small for them to read. Text styles grow with the size each user chooses, so the same app is readable for everyone.",
     "how": "SwiftUI sets the user's size in the environment, and text in a text style reads it, and picks its font size from it. Here the modifier `dynamicTypeSize` sets the size for the text, as Settings would. A layout must leave room for the larger sizes, such as by letting text wrap onto more lines.",
     "when": [
      {
       "text": "Use text styles, such as body, headline, and caption, for all text, so that every word follows the user's size."
      },
      {
       "text": "Don't give text a fixed size in points. It stays the same at every size the user chooses, and is too small for those who need it larger."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "text-style",
       "name": "The text style `.body`, line 7",
       "text": "The modifier `font` gives the text the body style, the style of the main text of a screen. A text style has a font size for each text size, so the text follows the user's choice."
      },
      {
       "part": "type-size",
       "name": "The text size, line 8",
       "text": "The modifier `dynamicTypeSize` sets the text size for the text, as the user's setting would. The size `.large` is the one most people use, and `.accessibility3` is one of the much larger sizes."
      }
     ],
     "marks": [
      {
       "line": 7,
       "text": ".font(.body)",
       "part": "text-style",
       "label": "text style"
      },
      {
       "line": 8,
       "text": "dynamicTypeSize(size)",
       "part": "type-size",
       "label": "text size"
      }
     ],
     "steps": [
      {
       "text": "Lines 3 and 4 name two text sizes, and the loop on line 5 runs first with `.large`.",
       "line": 5,
       "also": [
        3,
        4
       ]
      },
      {
       "text": "Lines 6 to 8 make a `Text` in the body style at the size `.large`. Line 9 makes a renderer, and line 10 draws it and prints the height of the image: {{large 21}}.",
       "line": 10,
       "also": [
        6,
        7,
        8,
        9
       ],
       "prints": [
        "large 21"
       ]
      },
      {
       "text": "The loop runs again with `.accessibility3`. The same text in the same style is now drawn much larger, and line 10 prints {{accessibility3 48}}.",
       "line": 10,
       "also": [
        8
       ],
       "prints": [
        "accessibility3 48"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The text in the body style took its font size from the text size, so the same words grew from 21 to 48 pixels tall."
     }
    }
   }
  },
  "element-identity": {
   "id": "element-identity",
   "name": "Identity of an element",
   "first": "The value that tells one element of a ForEach's data from the others: the element's id when it is identifiable, or the property that a key path names, which becomes the identity of the element's view.",
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
  "equal-to-operator": {
   "id": "equal-to-operator",
   "name": "Equal-to operator",
   "first": "Two equal signs between two values, which give true when the values are equal.",
   "parts": []
  },
  "explicit-identity": {
   "id": "explicit-identity",
   "name": "Explicit identity",
   "first": "A value given to a view with the id modifier, which SwiftUI compares as well as the view's place: when the value changes, the view is a new view, and its state starts again.",
   "parts": []
  },
  "feedback-kind": {
   "id": "feedback-kind",
   "name": "Kind of feedback",
   "first": "The feeling that haptic feedback plays, named for what happened, such as success, warning, error, or a change of selection.",
   "parts": []
  },
  "feedback-trigger": {
   "id": "feedback-trigger",
   "name": "Trigger",
   "first": "The value that a feedback modifier watches, which plays its feedback each time the value changes.",
   "parts": []
  },
  "fetch-descriptor": {
   "id": "fetch-descriptor",
   "name": "Fetch descriptor",
   "first": "A description of which models to fetch, and in what order, which a model context fetches.",
   "parts": []
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
  "focus-state-property": {
   "id": "focus-state-property",
   "name": "Focus state property",
   "first": "A property of a view marked with the FocusState attribute, which holds whether a field has the focus, or which field has it, and which SwiftUI changes as the focus moves.",
   "parts": []
  },
  "focus-state": {
   "id": "focus-state",
   "name": "Focus state",
   "area": "ui",
   "first": "A property wrapper that holds whether a field has the keyboard, or which field has it, and moves the keyboard when code changes its value.",
   "parts": [
    "focus-state-property",
    "focused-modifier"
   ],
   "dependsOn": [
    {
     "id": "text-field",
     "views": [
      "what"
     ],
     "why": "Focus says which field the keyboard types into, such as one of the text fields of a screen.",
     "whyInExample": "The `TextField` is the field that `editing` follows, as the `TextField` on the page of Text field edits `name`."
    },
    {
     "id": "state",
     "views": [
      "what"
     ],
     "why": "Focus state is kept as state of a view, and its changes run the view's body again.",
     "whyInExample": "The attribute `@FocusState` holds `editing` for `Signup`, as `@State` holds `taps` for `Counter`."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Signup: View {",
     "    @FocusState private var editing: Bool",
     "    @State private var name = \"\"",
     "    var body: some View {",
     "        TextField(\"Name\", text: $name)",
     "            .focused($editing)",
     "    }",
     "}",
     "print(type(of: Signup().body))"
    ],
    "output": [
     "ModifiedContent<TextField<Text>, FocusStateBindingModifier<Bool>>"
    ]
   },
   "views": {
    "what": {
     "is": "Focus is where the keyboard types: the field that has the focus gets the letters. A property marked `@FocusState` holds whether a field has the focus. The modifier `focused` links a field to it, so that the property changes when the user taps into the field or out of it, and the keyboard moves when code changes the property.",
     "marks": [
      {
       "line": 4,
       "text": "@FocusState private var editing: Bool",
       "part": "focus-state-property",
       "label": "has the focus?"
      },
      {
       "line": 8,
       "text": "focused($editing)",
       "part": "focused-modifier",
       "label": "links the field"
      }
     ],
     "afterExample": "In an app, `editing` would become true when the user taps into the field, and setting it to true would bring up the keyboard in that field. A program with no window has no keyboard, so line 11 prints the type: the field, with a modifier that links it to a focus state of type {{Bool}}.",
     "problem": "A screen with fields should put the keyboard where the user needs it: in the first field when the screen opens, in the next field after Return, and in an empty field when the user taps Save. Focus state lets code read and move the keyboard.",
     "how": "Apple's documentation says that when focus enters a field, the property becomes the value the field is linked with, true here, and when focus leaves, it goes back to false, or nil when it holds which of several fields has the focus. Setting the property from code moves the focus to the field that is linked with the new value.",
     "when": [
      {
       "text": "Use it to move the keyboard from code, such as into the first field when a form opens, or into the next field when the user presses Return."
      },
      {
       "text": "Don't keep it for a screen with one field that the user taps into. The field takes the focus on its own, with no code."
      }
     ]
    }
   }
  },
  "focused-modifier": {
   "id": "focused-modifier",
   "name": "Focused modifier",
   "first": "The modifier that links a field to a focus state property, so the property follows the field's focus, and setting the property moves the focus to the field.",
   "parts": []
  },
  "for-each-content": {
   "id": "for-each-content",
   "name": "Content closure",
   "first": "The closure of a ForEach, which it calls with one element at a time, and which returns the view for that element.",
   "parts": []
  },
  "for-each-data": {
   "id": "for-each-data",
   "name": "Data of a ForEach",
   "first": "The collection whose elements a ForEach makes one view for, in the order of the collection.",
   "parts": []
  },
  "for-each": {
   "id": "for-each",
   "name": "ForEach",
   "area": "ui",
   "first": "A structure that makes one view for each element of a collection, and tells the elements apart by their identity.",
   "parts": [
    "for-each-data",
    "element-identity",
    "for-each-content"
   ],
   "dependsOn": [
    {
     "id": "view-builder",
     "views": [
      "what",
      "parts"
     ],
     "why": "A ForEach is written among the views that a view builder combines, and its closure is built by the view builder too.",
     "whyInExample": "The `ForEach` is a view on its own line in the braces of `VStack`, as `Text(\"Lima\")` is in the `body` of `Card`."
    },
    {
     "id": "identifiable",
     "views": [
      "what",
      "parts"
     ],
     "why": "A ForEach tells its elements apart by their id, when the elements are identifiable.",
     "whyInExample": "The type `Trip` is identifiable, as `Trip` is on the page of Identifiable, so the `ForEach` uses each trip's `id`."
    },
    {
     "id": "view-identity",
     "views": [
      "what",
      "parts"
     ],
     "why": "The identity of each element becomes the identity of its view, so a view keeps its state while its element moves or changes.",
     "whyInExample": "The `id` of each trip is the explicit identity of its `Text`, as `version` is the id of `Counter` on the page of View identity."
    },
    {
     "id": "key-path",
     "views": [
      "what"
     ],
     "why": "For elements that are not identifiable, a ForEach is given a key path to the property that tells them apart."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Trip: Identifiable {",
     "    let id: Int",
     "    let city: String",
     "}",
     "",
     "let trips = [",
     "    Trip(id: 1, city: \"Lima\"),",
     "    Trip(id: 2, city: \"Oslo\")",
     "]",
     "var shown: [String] = []",
     "let column = VStack {",
     "    ForEach(trips) { trip in",
     "        Text(trip.city)",
     "            .onAppear { shown.append(trip.city) }",
     "    }",
     "}",
     "_ = ImageRenderer(content: column).cgImage",
     "print(shown.sorted())"
    ]
   },
   "snippets": {
    "keyPath": {
     "code": [
      "import SwiftUI",
      "",
      "let cities = [\"Lima\", \"Oslo\"]",
      "let rows = ForEach(cities, id: \\.self) { city in",
      "    Text(city)",
      "}",
      "print(type(of: rows))"
     ],
     "output": [
      "ForEach<Array<String>, String, Text>"
     ]
    }
   },
   "views": {
    "what": {
     "is": "A `ForEach` is a structure that makes one view for each element of a collection, from a closure that it calls with each element. It tells the elements apart by their identity, and the identity of an element becomes the identity of its view.",
     "marks": [
      {
       "line": 14,
       "text": "trips",
       "part": "for-each-data",
       "label": "the elements"
      },
      {
       "line": 14,
       "text": "{ trip in",
       "part": "for-each-content",
       "label": "one view per element"
      }
     ],
     "afterExample": "The `ForEach` makes a `Text` for each of the two trips, and each one adds its city to `shown` when it appears, so line 20 prints both cities.",
     "problem": "A screen often shows one view for each item of data, such as a row for each trip, and the number of items changes. A `ForEach` makes those views from the data. Because it knows each element's identity, SwiftUI can tell which view belongs to which item when items are added, removed, or moved.",
     "how": "Apple's documentation says that a `ForEach` computes views on demand from a collection of identified data, and that its elements must be identifiable, or it must be given an `id` parameter. For each element, it calls its closure, which returns the view for that element, and it gives that view the element's identity. Apple's documentation also says that if an element's id changes, the view made from it loses its state.",
     "when": [
      {
       "text": "Use it inside a stack, a list, or any other view that lists views, for a view per item of data. For elements that are not identifiable, such as strings, give it a key path to the property that is unique, with `id:`. The key path `\\.self` names the whole element:",
       "snippet": "keyPath"
      },
      {
       "text": "Don't identify the elements by a value that changes, such as a city that the user can edit. Apple's documentation says that when an element's id changes, the view made from it loses its state and its animations."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "for-each-data",
       "name": "The data `trips`, line 14",
       "text": "The first argument of `ForEach` is the collection whose elements it makes views for, in order. Here it is `trips`, an array of two trips."
      },
      {
       "part": "element-identity",
       "name": "The identity of each trip",
       "text": "The elements are identifiable, so the `ForEach` tells them apart by `id`, which line 4 declares. The view for a trip has that trip's `id` as its identity."
      },
      {
       "part": "for-each-content",
       "name": "The closure, lines 14 to 17",
       "text": "The closure takes one element, `trip`, and returns the view for it: a `Text` of the trip's city, which adds the city to `shown` when it appears. The view builder builds the closure's body, as it builds the body of a view."
      }
     ],
     "marks": [
      {
       "line": 14,
       "text": "trips",
       "part": "for-each-data",
       "label": "data"
      },
      {
       "line": 4,
       "text": "let id: Int",
       "part": "element-identity",
       "label": "identity"
      },
      {
       "line": 14,
       "text": "{ trip in",
       "part": "for-each-content",
       "label": "content"
      }
     ],
     "steps": [
      {
       "text": "Lines 8 to 11 make an array of two trips, and line 12 makes an empty array, `shown`.",
       "line": 8,
       "also": [
        12
       ]
      },
      {
       "text": "Line 13 makes a `VStack` whose one view is a `ForEach` over `trips`.",
       "line": 13,
       "also": [
        14
       ]
      },
      {
       "text": "Line 19 makes a renderer for the column and asks for its image. The `ForEach` calls its closure for each trip, and gives each `Text` the trip's `id` as its identity.",
       "line": 19,
       "also": [
        15
       ]
      },
      {
       "text": "Each `Text` appears, and the closure of `onAppear` on line 16 adds its city to `shown`.",
       "line": 16
      },
      {
       "text": "Line 20 prints the cities that appeared, sorted, because SwiftUI does not promise the order in which views appear: {{[\"Lima\", \"Oslo\"]}}.",
       "line": 20,
       "prints": [
        "[\"Lima\", \"Oslo\"]"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The `ForEach` made one `Text` for each element of `trips`, and gave each one the identity of its trip."
     }
    }
   }
  },
  "form": {
   "id": "form",
   "name": "Form",
   "area": "ui",
   "first": "A view that arranges controls for entering data, such as a settings screen, grouped in sections and styled for each platform.",
   "parts": [
    "list-section"
   ],
   "dependsOn": [
    {
     "id": "control",
     "views": [
      "what"
     ],
     "why": "A form holds controls, which it styles for entering data.",
     "whyInExample": "The `Toggle` in the form is a control with a binding, as the `Toggle` on the page of Control is."
    },
    {
     "id": "list",
     "views": [
      "what"
     ],
     "why": "On iOS, a form is drawn as a list of grouped rows, with sections.",
     "whyInExample": "The `Section` groups the two controls under a header, as a `Section` groups cities on the page of List."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Settings: View {",
     "    @State private var alerts = true",
     "    @State private var nights = 3",
     "    var body: some View {",
     "        Form {",
     "            Section(\"Trip\") {",
     "                Toggle(\"Alerts\", isOn: $alerts)",
     "                Stepper(\"Nights\", value: $nights)",
     "            }",
     "        }",
     "    }",
     "}",
     "print(type(of: Settings().body))"
    ],
    "output": [
     "Form<Section<Text, TupleView<(Toggle<Text>, Stepper<Text>)>, EmptyView>>"
    ]
   },
   "views": {
    "what": {
     "is": "A `Form` is a view that arranges controls for entering data, such as the screen of an app's settings. Apple's documentation says that SwiftUI styles the views inside a form for each platform: on iOS a form is a list of grouped rows, and on the Mac a stack of aligned controls. A `Section` groups rows under a header.",
     "marks": [
      {
       "line": 7,
       "text": "Form",
       "label": "styles the controls"
      },
      {
       "line": 8,
       "text": "Section(\"Trip\")",
       "part": "list-section",
       "label": "a group of rows"
      }
     ],
     "afterExample": "The form has one section, Trip, with a toggle for alerts and a stepper for the number of nights. Line 15 prints the type of the `body`: a form whose content is the section, whose header is a text, Trip, and whose rows are the two controls.",
     "problem": "A screen of settings or details needs labels and controls lined up the same way in every app on the platform. A form gives the controls that style, so the code only lists them.",
     "how": "The form styles each control inside it, such as buttons, toggles, and pickers, as rows of a grouped list on iOS. Each control still reads and writes its value through its binding, as it does anywhere else.",
     "when": [
      {
       "text": "Use it for a screen of settings, or of fields to fill in, such as the details of a new trip."
      },
      {
       "text": "Don't use it for content that is not input, such as a list of trips to read. A list or a stack shows content without the style of a form."
      }
     ]
    }
   }
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
  "geometry-id": {
   "id": "geometry-id",
   "name": "Matched id",
   "first": "The hashable value that views share to be matched, so that SwiftUI moves the frame from one to the other.",
   "parts": []
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
  "gesture-callback": {
   "id": "gesture-callback",
   "name": "Gesture closure",
   "first": "A closure given to a gesture, which the gesture calls with its value as the touch changes or when it ends, such as how far a drag moved.",
   "parts": []
  },
  "gesture-modifier": {
   "id": "gesture-modifier",
   "name": "Gesture modifier",
   "first": "The modifier that adds a gesture to a view, so that the view recognizes that touch.",
   "parts": []
  },
  "gesture-state-property": {
   "id": "gesture-state-property",
   "name": "Gesture state property",
   "first": "A property of a view marked with the GestureState attribute, which a gesture sets while it is in progress, and which goes back to its first value when the gesture ends.",
   "parts": []
  },
  "gesture-state": {
   "id": "gesture-state",
   "name": "Gesture state",
   "area": "ui",
   "first": "A property wrapper that holds a value only while a gesture is in progress, and goes back to its first value on its own when the gesture ends.",
   "parts": [
    "gesture-state-property",
    "updating-callback"
   ],
   "dependsOn": [
    {
     "id": "gesture",
     "views": [
      "what"
     ],
     "why": "Gesture state is changed by a gesture while it is in progress.",
     "whyInExample": "The property `follow` is a drag gesture, as `drag` is on the page of Gesture."
    },
    {
     "id": "state",
     "views": [
      "what"
     ],
     "why": "Gesture state is kept for a view as state is, and its changes run the view's body again.",
     "whyInExample": "The attribute `@GestureState` holds `drag` for `Card`, as `@State` holds `taps` for `Counter`."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Card: View {",
     "    @GestureState private var drag = CGSize.zero",
     "    var body: some View {",
     "        let _ = print(\"offset is\", drag)",
     "        Text(\"Lima\")",
     "            .offset(drag)",
     "            .gesture(follow)",
     "    }",
     "    var follow: some Gesture {",
     "        DragGesture()",
     "            .updating($drag) { value, state, _ in",
     "                state = value.translation",
     "            }",
     "    }",
     "}",
     "_ = ImageRenderer(content: Card()).cgImage"
    ],
    "output": [
     "offset is (0.0, 0.0)"
    ]
   },
   "views": {
    "what": {
     "is": "A property marked `@GestureState` holds a value while a gesture is in progress. The gesture's method `updating` is given a binding to it, and a closure that sets the value from the gesture's value. Apple's documentation says that the property goes back to its first value when the gesture ends.",
     "marks": [
      {
       "line": 4,
       "text": "@GestureState private var drag = CGSize.zero",
       "part": "gesture-state-property",
       "label": "only while dragging"
      },
      {
       "line": 13,
       "text": "updating($drag)",
       "part": "updating-callback",
       "label": "sets it from the drag"
      }
     ],
     "afterExample": "While the user drags the card, `drag` holds how far the finger moved, so the card follows the finger. When the finger lifts, `drag` goes back to zero, and the card goes back. No one drags here, so the `body` runs once, with `drag` at its first value, and line 6 prints {{offset is (0.0, 0.0)}}.",
     "problem": "Some values matter only during a touch, such as how far a card is dragged before it is let go. With plain state, code must remember to set it back when the gesture ends, or is cancelled. Gesture state goes back to its first value on its own.",
     "how": "Apple's documentation says to pass a binding to the property to a gesture's `updating` closure, which is called as the gesture changes, and that the property resets when the gesture becomes inactive. In the closure, `state` is the value to set, and `value` is the gesture's value, such as its `translation`.",
     "when": [
      {
       "text": "Use it for a value that shows a touch in progress, such as how far a card is dragged, or whether a button is held down."
      },
      {
       "text": "Don't use it for a result that must stay after the gesture, such as where a card was dropped. Gesture state goes back on its own, so keep that result in state, set in the gesture's closure for its end."
      }
     ]
    }
   }
  },
  "gesture": {
   "id": "gesture",
   "name": "Gesture",
   "area": "ui",
   "first": "A touch that a view recognizes, such as a tap, a drag, a pinch, or a rotation, which runs code as it changes and when it ends.",
   "parts": [
    "gesture-modifier",
    "gesture-callback"
   ],
   "dependsOn": [
    {
     "id": "view-modifier",
     "views": [
      "what"
     ],
     "why": "A gesture is added to a view with a modifier.",
     "whyInExample": "The call `gesture(drag)` is a modifier of the `Text`, as `padding(8)` is a modifier of `city`."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "let drag = DragGesture()",
     "    .onEnded { value in",
     "        print(\"moved\", value.translation)",
     "    }",
     "let card = Text(\"Lima\").gesture(drag)",
     "print(type(of: card))"
    ],
    "output": [
     "ModifiedContent<Text, AddGestureModifier<_EndedGesture<DragGesture>, DefaultGestureCombiner>>"
    ]
   },
   "views": {
    "what": {
     "is": "A gesture is a touch that a view recognizes, such as a tap, a long press, a drag, a pinch, or a rotation. A gesture is a value, such as a `DragGesture`. Methods on it, such as `onEnded`, give it closures that it calls with its value as it changes and when it ends. The modifier `gesture` adds it to a view.",
     "marks": [
      {
       "line": 3,
       "text": "DragGesture()",
       "label": "a drag"
      },
      {
       "line": 4,
       "text": "onEnded",
       "part": "gesture-callback",
       "label": "runs at the end"
      },
      {
       "line": 7,
       "text": "gesture(drag)",
       "part": "gesture-modifier",
       "label": "adds it to the view"
      }
     ],
     "afterExample": "When the user drags the card and lifts the finger, the drag would call its closure with its value, and line 5 would print how far the finger moved. A program with no window has no touches, so line 8 prints the type: the `Text`, with a modifier that adds a drag gesture with a closure for its end.",
     "problem": "Buttons and controls cover taps on things that look tappable. Other touches, such as dragging a card, pinching a map, or pressing and holding a photo, need code that follows the finger. A gesture recognizes such a touch, and gives the code its values.",
     "how": "Apple's documentation says that a gesture matches a sequence of touch events, and gives a value for each of its states. A drag's value holds where it started, where the finger is, and how far it moved, `translation`. A gesture can be given a closure for each change, and the closure of `onEnded` is called with its last value.",
     "when": [
      {
       "text": "Use a gesture for a touch that is not a tap on a control, such as dragging a card to sort it, or pressing and holding to see more."
      },
      {
       "text": "Don't use a tap gesture for an action that a button can do. A button has the platform's look, and VoiceOver reads it as a button."
      }
     ]
    }
   }
  },
  "glass-effect-modifier": {
   "id": "glass-effect-modifier",
   "name": "Glass effect modifier",
   "first": "The modifier that puts Liquid Glass behind a view, by default the regular glass in the shape of a capsule, filling the view's frame.",
   "parts": []
  },
  "gradient-axis": {
   "id": "gradient-axis",
   "name": "Start and end points",
   "first": "The two places in a rectangle, such as its leading and trailing edges, between which a linear gradient changes its color.",
   "parts": []
  },
  "gradient-colors": {
   "id": "gradient-colors",
   "name": "Colors of a gradient",
   "first": "The colors that a gradient goes through, in order, which it blends from one to the next.",
   "parts": []
  },
  "gradient": {
   "id": "gradient",
   "name": "Gradient",
   "area": "ui",
   "first": "A fill whose color changes smoothly between two or more colors, along a line, around a center, or out from a center.",
   "parts": [
    "gradient-colors",
    "gradient-axis"
   ],
   "dependsOn": [
    {
     "id": "shape",
     "views": [
      "what",
      "parts"
     ],
     "why": "A gradient fills a shape, as a color does, and is also a view that takes the whole size it is proposed.",
     "whyInExample": "The gradient `fade` takes the whole size it is proposed, 101 by 1, as `Pennant` takes 60 by 30 on the page of Shape."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "let fade = LinearGradient(",
     "    colors: [.black, .white],",
     "    startPoint: .leading,",
     "    endPoint: .trailing",
     ")",
     "let size = CGSize(width: 101, height: 1)",
     "let renderer = ImageRenderer(content: fade)",
     "renderer.proposedSize = ProposedViewSize(size)",
     "let image = renderer.cgImage!",
     "let pixels = image.dataProvider!.data! as Data",
     "for x in [0, 25, 50, 75, 100] {",
     "    print(x, pixels[x * 4])",
     "}"
    ]
   },
   "views": {
    "what": {
     "is": "A gradient is a fill whose color changes smoothly from one color to the next. A `LinearGradient` changes along a line, from its start point to its end point. A radial gradient changes out from a center, and an angular gradient changes around a center. A gradient fills a shape, as a color does, or is shown as a view of its own.",
     "marks": [
      {
       "line": 4,
       "text": "[.black, .white]",
       "part": "gradient-colors",
       "label": "its colors"
      },
      {
       "line": 5,
       "text": "startPoint: .leading",
       "part": "gradient-axis",
       "label": "from"
      },
      {
       "line": 6,
       "text": "endPoint: .trailing",
       "part": "gradient-axis",
       "label": "to"
      }
     ],
     "afterExample": "The gradient goes from black at the leading edge to white at the trailing edge. Drawn as a row of 101 pixels, each pixel is lighter than the one before it, from 0, black, to 254, almost white.",
     "problem": "A flat color can look plain on a large area, such as the header of a trip or the background of a card. A gradient changes the color across the area, in a direction that the code chooses, and SwiftUI draws it at any size.",
     "how": "Apple's documentation says that a linear gradient applies its colors along an axis, set by its start and end points, and maps that axis into the rectangle of each shape it fills. The points are given as places in the rectangle, such as `.leading` and `.trailing`, so the gradient fits any size.",
     "when": [
      {
       "text": "Use a gradient for the background of a large area, such as a header or a card, or to fade content into a background."
      },
      {
       "text": "Don't put text on a gradient whose colors are both near the color of the text. Some of the text would be hard to read."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "gradient-colors",
       "name": "The colors, line 4",
       "text": "The argument `colors` lists the colors that the gradient goes through, in order, here black and then white. More colors make more changes along the way."
      },
      {
       "part": "gradient-axis",
       "name": "The start and end points, lines 5 and 6",
       "text": "The start point `.leading` and the end point `.trailing` set the line that the color changes along: from the middle of the leading edge to the middle of the trailing edge, so the color changes from left to right."
      }
     ],
     "marks": [
      {
       "line": 4,
       "text": "[.black, .white]",
       "part": "gradient-colors",
       "label": "colors"
      },
      {
       "line": 5,
       "text": "startPoint: .leading",
       "part": "gradient-axis",
       "label": "start"
      },
      {
       "line": 6,
       "text": "endPoint: .trailing",
       "part": "gradient-axis",
       "label": "end"
      }
     ],
     "steps": [
      {
       "text": "Lines 3 to 7 make a linear gradient from black, at the leading edge, to white, at the trailing edge.",
       "line": 3,
       "also": [
        4,
        5,
        6,
        7
       ]
      },
      {
       "text": "Lines 8 to 10 make a renderer that proposes 101 by 1, one row of 101 pixels, and line 11 draws the gradient in it.",
       "line": 11,
       "also": [
        8,
        9,
        10
       ]
      },
      {
       "text": "Line 12 reads the bytes of the image. Each pixel has 4 bytes, for its red, green, blue, and opacity, each from 0 for none to 255 for full. In a gray, the red, green, and blue are equal.",
       "line": 12
      },
      {
       "text": "Lines 13 to 15 print the red byte of 5 pixels across the row: {{0 0}}, {{25 34}}, {{50 100}}, {{75 172}}, and {{100 254}}. Each one is lighter than the one before it.",
       "line": 14,
       "also": [
        13
       ],
       "prints": [
        "0 0",
        "25 34",
        "50 100",
        "75 172",
        "100 254"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The gradient filled the whole row, and changed from black to almost white along the line from its start point to its end point."
     }
    }
   }
  },
  "graphics-context": {
   "id": "graphics-context",
   "name": "Graphics context",
   "first": "The value that a canvas gives its closure to draw with, whose methods fill and stroke paths, and draw images and text.",
   "parts": []
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
  "haptic-feedback": {
   "id": "haptic-feedback",
   "name": "Haptic feedback",
   "area": "ui",
   "first": "A modifier that plays a feeling the user's hand senses, such as a tap or a success, each time a value changes.",
   "parts": [
    "feedback-kind",
    "feedback-trigger"
   ],
   "dependsOn": [
    {
     "id": "view-modifier",
     "views": [
      "what"
     ],
     "why": "Haptic feedback is added to a view with a modifier.",
     "whyInExample": "The call `sensoryFeedback` is a modifier of the button, as `padding(8)` is a modifier of `city`."
    },
    {
     "id": "control",
     "views": [
      "what"
     ],
     "why": "The value that plays the feedback is usually changed by a control, such as a button.",
     "whyInExample": "The action of the Save button adds 1 to `saves`, as the action of Save prints on the page of Control."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Saver: View {",
     "    @State private var saves = 0",
     "    var body: some View {",
     "        Button(\"Save\") { saves += 1 }",
     "            .sensoryFeedback(",
     "                .success, trigger: saves",
     "            )",
     "    }",
     "}",
     "print(type(of: Saver().body))"
    ],
    "output": [
     "ModifiedContent<Button<Text>, FeedbackGenerator<Int>>"
    ]
   },
   "views": {
    "what": {
     "is": "Haptic feedback is a short vibration that the user feels, on devices that have the hardware for it, such as an iPhone. The modifier `sensoryFeedback` plays a kind of feedback, such as `.success`, each time the value it watches changes.",
     "marks": [
      {
       "line": 8,
       "text": ".success",
       "part": "feedback-kind",
       "label": "what to play"
      },
      {
       "line": 8,
       "text": "trigger: saves",
       "part": "feedback-trigger",
       "label": "when to play"
      }
     ],
     "afterExample": "Each tap on Save adds 1 to `saves`, so the value changes, and an iPhone plays the feeling of success. A program with no device to play on prints the type: the button, with a modifier that plays feedback when an {{Int}} changes.",
     "problem": "Some events need to be felt as well as seen, such as a save that worked, or a drag that reached its place. Haptic feedback lets the user feel the moment, without looking.",
     "how": "Apple's documentation says that the modifier plays its feedback when the trigger value changes. So the code only changes a value, as it already does when something happens, and calls nothing to play the feedback. The kinds of feedback are named for what happened, such as success, warning, error, and a change of selection.",
     "when": [
      {
       "text": "Use it for a moment the user should feel, such as a completed save, or the end of a drag."
      },
      {
       "text": "Don't play it for every change. Feedback that comes too often stops meaning anything."
      }
     ]
    }
   }
  },
  "hash-value": {
   "id": "hash-value",
   "name": "Hash value",
   "first": "One integer that a hashable value is turned into, which is the same for every two equal values, and which a set or a dictionary uses to find where it keeps the value.",
   "parts": []
  },
  "hashable": {
   "id": "hashable",
   "name": "Hashable",
   "area": "swift",
   "first": "A protocol for a type whose values can be compared for equality and turned into one integer, their hash value, so that they can be the members of a set or the keys of a dictionary.",
   "parts": [
    "conformance",
    "equal-to-operator",
    "hash-value"
   ],
   "dependsOn": [
    {
     "id": "protocol",
     "views": [
      "what",
      "parts"
     ],
     "why": "Hashable is a protocol, whose requirements are the comparison and the hash.",
     "whyInExample": "The type `City` conforms to `Hashable`, as `Friendly` conforms to `Greeter`."
    },
    {
     "id": "structure",
     "views": [
      "what",
      "parts"
     ],
     "why": "swiftc writes the comparison and the hash for a structure from its stored properties.",
     "whyInExample": "The type `City` is a structure with two stored properties, `name` and `country`, as `Trip` has `city` and `nights` on the page of Structure."
    }
   ],
   "example": {
    "code": [
     "struct City: Hashable {",
     "    let name: String",
     "    let country: String",
     "}",
     "",
     "let lima = City(name: \"Lima\", country: \"Peru\")",
     "let again = City(name: \"Lima\", country: \"Peru\")",
     "print(lima == again)",
     "let visited: Set = [lima, again]",
     "print(visited.count)",
     "let nights = [lima: 4]",
     "print(nights[again, default: 0])"
    ],
    "sil": [
     {
      "in": "static City.__derived_struct_equals(_:_:)",
      "has": "#City.country",
      "shows": "swiftc writes the comparison of two cities for City, which compares country as well as name."
     },
     {
      "in": "City.hash(into:)",
      "has": "#City.name",
      "shows": "swiftc writes the method hash(into:) for City, which gives name to the hasher."
     },
     {
      "in": "City.hash(into:)",
      "has": "#City.country",
      "shows": "The method hash(into:) gives country to the hasher too, so the hash value comes from both properties."
     }
    ]
   },
   "views": {
    "what": {
     "is": "A type that conforms to the protocol `Hashable` has values that can be compared for equality, with `==`, and hashed: turned into one integer, the hash value, which is the same for every two equal values. A set and a dictionary find a value by its hash value, so their members and keys must be hashable.",
     "marks": [
      {
       "line": 1,
       "text": "Hashable",
       "part": "conformance",
       "label": "hashable"
      },
      {
       "line": 8,
       "text": "==",
       "part": "equal-to-operator",
       "label": "equal?"
      }
     ],
     "afterExample": "The constants `lima` and `again` are two instances with the same values, so they are equal. The set on line 9 keeps only one of them, and the dictionary on line 11 finds the value for `lima` when it is given `again`.",
     "problem": "A set must know when two values are the same, so that it keeps one, and a dictionary must find a key's value without comparing the key with every key it has. A hash value tells them where to look, so they compare only the few values kept there.",
     "how": "When every stored property of a structure is hashable, swiftc writes `==` and the hash for it. The comparison `==` compares each property, and the hash combines the hash of each property. Two equal values give the same hash value, so a set or a dictionary finds equal values in the same place.",
     "when": [
      {
       "text": "Use it for a type whose values are members of a set or keys of a dictionary, such as a city, or that tell the items of a list apart."
      },
      {
       "text": "Don't write `==` and the hash yourself when swiftc can write them. Written by hand, two equal values must still give the same hash value, or a set or a dictionary can lose them."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "conformance",
       "name": "The conformance to `Hashable`, line 1",
       "text": "The colon and the name `Hashable` after `City` say that `City` conforms to the protocol `Hashable`. Its stored properties, `name` and `country`, are strings, which are hashable, so swiftc writes the comparison and the hash for `City`."
      },
      {
       "part": "equal-to-operator",
       "name": "The equal-to operator, line 8",
       "text": "Two equal signs compare two values, and give true when they are equal. The `==` that swiftc writes for `City` gives true when `name` and `country` are both equal."
      },
      {
       "part": "hash-value",
       "name": "The hash values, lines 9 and 11",
       "text": "A set and a dictionary hash each value they are given: they turn it into one integer, from the hash of each stored property. Equal values give the same integer, so `again` is found where `lima` was put."
      }
     ],
     "marks": [
      {
       "line": 1,
       "text": "Hashable",
       "part": "conformance",
       "label": "conformance"
      },
      {
       "line": 8,
       "text": "==",
       "part": "equal-to-operator",
       "label": "equal-to"
      },
      {
       "line": 9,
       "text": "Set",
       "part": "hash-value",
       "label": "hashes each member"
      },
      {
       "line": 11,
       "text": "[lima: 4]",
       "part": "hash-value",
       "label": "hashes the key"
      }
     ],
     "steps": [
      {
       "text": "Lines 6 and 7 make two cities with the same name and the same country.",
       "line": 6,
       "also": [
        7
       ]
      },
      {
       "text": "Line 8 compares them with `==`, which compares `name` and then `country`. Both are equal, so it prints {{true}}.",
       "line": 8,
       "also": [
        2,
        3
       ],
       "prints": [
        "true"
       ]
      },
      {
       "text": "Line 9 makes a set of `lima` and `again`. The set hashes each one. They give the same hash value and are equal, so the set keeps only one.",
       "line": 9
      },
      {
       "text": "Line 10 prints how many members the set has: {{1}}.",
       "line": 10,
       "prints": [
        "1"
       ]
      },
      {
       "text": "Line 11 makes a dictionary with `lima` as its one key, for the value 4.",
       "line": 11
      },
      {
       "text": "Line 12 looks up `again`. Its hash value is the hash value of `lima`, and the two are equal, so the dictionary finds 4, and line 12 prints {{4}}. With no such key, it would give 0, the value after `default:`.",
       "line": 12,
       "prints": [
        "4"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "Equal cities gave the same hash value, so the set kept one of them, and the dictionary found the value of `lima` from `again`."
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
  "hosted-root-view": {
   "id": "hosted-root-view",
   "name": "Hosted root view",
   "first": "The SwiftUI view that a hosting controller shows, given when the controller is made, and changed by setting its root view property.",
   "parts": []
  },
  "hosting-controller": {
   "id": "hosting-controller",
   "name": "Hosting controller",
   "area": "ui",
   "first": "A UIKit view controller that shows a SwiftUI view, so that a UIKit app can use SwiftUI one screen at a time.",
   "parts": [
    "hosted-root-view"
   ],
   "dependsOn": [
    {
     "id": "view",
     "views": [
      "what",
      "parts"
     ],
     "why": "A hosting controller shows a SwiftUI view, and runs its body as SwiftUI does in an app.",
     "whyInExample": "The type `Greeting` is a view with a `body`, as `Greeting` is on the page of View."
    },
    {
     "id": "class",
     "views": [
      "what"
     ],
     "why": "A UIKit view controller is a class, which UIKit code holds by reference.",
     "whyInExample": "The constant `host` holds a reference to the controller, as `first` holds a reference to a `Counter` on the page of Class."
    }
   ],
   "example": {
    "ios": true,
    "code": [
     "import SwiftUI",
     "import UIKit",
     "",
     "struct Greeting: View {",
     "    var body: some View {",
     "        let _ = print(\"body runs\")",
     "        Text(\"Trips\")",
     "    }",
     "}",
     "",
     "let host = UIHostingController(",
     "    rootView: Greeting()",
     ")",
     "print(type(of: host.rootView))",
     "let room = CGSize(width: 300, height: 300)",
     "let size = host.sizeThatFits(in: room)",
     "print(size.width > 0, size.height > 0)"
    ]
   },
   "views": {
    "what": {
     "is": "A `UIHostingController` is a UIKit view controller that shows a SwiftUI view, its root view. A UIKit app uses it as any other view controller, such as by pushing it or presenting it, so the app can add SwiftUI one screen at a time.",
     "marks": [
      {
       "line": 11,
       "text": "UIHostingController",
       "label": "a UIKit view controller"
      },
      {
       "line": 12,
       "text": "rootView: Greeting()",
       "part": "hosted-root-view",
       "label": "the SwiftUI view it shows"
      }
     ],
     "afterExample": "The hosting controller holds a `Greeting` as its root view. When it is asked what size it needs, it lays out the SwiftUI view, which runs its `body`. The program runs on an iPhone in the simulator, because UIKit is a framework of iOS.",
     "problem": "Many apps were written in UIKit, and cannot be written again all at once. A hosting controller lets a UIKit app show a new screen written in SwiftUI, beside its UIKit screens.",
     "how": "Apple's documentation says that a hosting controller manages a SwiftUI view hierarchy, that its root view is given when it is made and can be changed later through `rootView`, and that it is used like any other view controller. Its view draws the SwiftUI views, and SwiftUI updates them as it does in a SwiftUI app.",
     "when": [
      {
       "text": "Use it to show SwiftUI in a UIKit app, such as a new settings screen pushed by a UIKit navigation controller."
      },
      {
       "text": "Don't use it in an app that is all SwiftUI. There, views are already shown inside the app's scenes."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "hosted-root-view",
       "name": "The root view, line 12",
       "text": "The argument `rootView` is the SwiftUI view that the controller shows: a `Greeting`. The property `rootView` reads it, and setting the property shows a different view."
      }
     ],
     "marks": [
      {
       "line": 12,
       "text": "rootView: Greeting()",
       "part": "hosted-root-view",
       "label": "root view"
      }
     ],
     "steps": [
      {
       "text": "Lines 11 to 13 make a hosting controller whose root view is a `Greeting`.",
       "line": 11,
       "also": [
        12
       ]
      },
      {
       "text": "Line 14 prints the type of its root view: {{Greeting}}.",
       "line": 14,
       "prints": [
        "Greeting"
       ]
      },
      {
       "text": "Line 16 asks the controller what size it needs inside 300 by 300 points, the size on line 15. It lays out its SwiftUI view, so the `body` of `Greeting` runs, and line 6 prints {{body runs}}.",
       "line": 6,
       "also": [
        15,
        16
       ],
       "prints": [
        "body runs"
       ]
      },
      {
       "text": "Line 17 prints whether the size is more than zero across and down: {{true true}}. It is the size of the text Trips.",
       "line": 17,
       "prints": [
        "true true"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The UIKit view controller held a SwiftUI view, and laid it out, running its `body`, as SwiftUI would in an app."
     }
    }
   }
  },
  "id-property": {
   "id": "id-property",
   "name": "Id property",
   "first": "The property that an identifiable type must have, whose value gives each value of the type its identity, and stays the same while the value's other properties change.",
   "parts": []
  },
  "identifiable": {
   "id": "identifiable",
   "name": "Identifiable",
   "area": "swift",
   "first": "A protocol for a type whose values each have an identity, a value that stays the same while their other properties change.",
   "parts": [
    "conformance",
    "id-property"
   ],
   "dependsOn": [
    {
     "id": "protocol",
     "views": [
      "what",
      "parts"
     ],
     "why": "Identifiable is a protocol, whose one requirement is a property that gives each value its identity.",
     "whyInExample": "The type `Trip` conforms to `Identifiable` by having `id`, as `Friendly` conforms to `Greeter` by having `greet(name:)`."
    },
    {
     "id": "structure",
     "views": [
      "what"
     ],
     "why": "An identifiable type is often a structure, whose instances are copied, so an identity is what says that two copies are the same item.",
     "whyInExample": "The type `Trip` is a structure, as `Trip` is on the page of Structure, so `trips[0]` holds its own copy of each value."
    }
   ],
   "example": {
    "code": [
     "struct Trip: Identifiable {",
     "    let id: Int",
     "    var city: String",
     "}",
     "",
     "var trips = [",
     "    Trip(id: 1, city: \"Lima\"),",
     "    Trip(id: 2, city: \"Oslo\")",
     "]",
     "let chosen = trips[0].id",
     "trips[0].city = \"Cusco\"",
     "trips.reverse()",
     "for trip in trips {",
     "    if trip.id == chosen {",
     "        print(trip.city)",
     "    }",
     "}"
    ]
   },
   "views": {
    "what": {
     "is": "A type that conforms to the protocol `Identifiable` has a property named `id`, which gives each value its identity. The identity stays the same while the value's other properties change, so code can tell which item a value is after it changes or moves.",
     "marks": [
      {
       "line": 1,
       "text": "Identifiable",
       "part": "conformance",
       "label": "identifiable"
      },
      {
       "line": 2,
       "text": "let id: Int",
       "part": "id-property",
       "label": "its identity"
      }
     ],
     "afterExample": "Line 11 changes the city of the first trip, and line 12 moves it to the end of the array. Its `id` is still 1, so lines 13 to 17 find it again, and print its new city.",
     "problem": "A structure is copied, so two copies of a trip are two separate values, and after a trip's city changes, nothing in its values says it is the same trip as before. An identity that never changes says which item a value is, so code, and SwiftUI, can follow one item through every change.",
     "how": "The protocol requires one property, `id`, whose type must be hashable, such as `Int` or `String`. Apple's documentation says that the `id` identifies an item even when its other data changes. Code compares two items' `id` to tell whether they are the same item.",
     "when": [
      {
       "text": "Use it for the items of a list that changes, such as trips that the user edits, adds, and deletes, so that each one can be followed by its `id`."
      },
      {
       "text": "Don't make `id` a value that can change, such as `city`. A changed id would make the same item look like a new one."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "conformance",
       "name": "The conformance to `Identifiable`, line 1",
       "text": "The colon and the name `Identifiable` after `Trip` say that `Trip` conforms to the protocol `Identifiable`. Its one requirement is a property named `id`."
      },
      {
       "part": "id-property",
       "name": "The property `id`, line 2",
       "text": "Each trip has an `id`, of type `Int`. It is a constant, declared with `let`, so no code can change it, while `city` is a variable that code can change."
      }
     ],
     "marks": [
      {
       "line": 1,
       "text": "Identifiable",
       "part": "conformance",
       "label": "conformance"
      },
      {
       "line": 2,
       "text": "let id: Int",
       "part": "id-property",
       "label": "id"
      }
     ],
     "steps": [
      {
       "text": "Lines 6 to 9 make an array of two trips, whose ids are 1 and 2.",
       "line": 6,
       "also": [
        7,
        8
       ]
      },
      {
       "text": "Line 10 keeps the id of the first trip in `chosen`.",
       "line": 10,
       "value": {
        "line": 10,
        "name": "chosen",
        "is": "1"
       }
      },
      {
       "text": "Line 11 changes the city of that trip to `\"Cusco\"`. Its `id` is still 1.",
       "line": 11
      },
      {
       "text": "Line 12 reverses the array, so that trip is now the second one.",
       "line": 12
      },
      {
       "text": "Lines 13 to 17 go through the trips and find the one whose `id` is `chosen`. Line 15 prints its city: {{Cusco}}.",
       "line": 15,
       "also": [
        13,
        14
       ],
       "prints": [
        "Cusco"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The trip moved and its city changed, but its `id` stayed 1, so the code found the same trip by its `id`."
     }
    }
   }
  },
  "identity-operator": {
   "id": "identity-operator",
   "name": "Identity operator",
   "first": "Three equal signs between two references, which give true when both refer to the same instance.",
   "parts": []
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
  "inflection": {
   "id": "inflection",
   "name": "Inflection",
   "first": "A mark in a localized string that makes Foundation change words to agree with a number, such as night for one and nights for more.",
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
  "keyframe-animation": {
   "id": "keyframe-animation",
   "name": "Keyframe animation",
   "area": "ui",
   "first": "An animation that moves a value through set values at set times, one stage after another, in place of going straight from an old value to a new one.",
   "parts": [
    "keyframe-start",
    "keyframe"
   ],
   "dependsOn": [
    {
     "id": "animation",
     "views": [
      "what",
      "parts"
     ],
     "why": "A keyframe animation is an animation, whose value changes over time, as an animation's curve says how far along a change is.",
     "whyInExample": "The method `value(time:)` gives the value at a moment, as `value(at:)` gives how far along the change is on the page of Animation."
    },
    {
     "id": "result-builder",
     "views": [
      "parts"
     ],
     "why": "The keyframes are listed in braces, one per line, which a result builder combines.",
     "whyInExample": "The braces after `KeyframeTimeline` list keyframes one per line, as `packing()` lists strings."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "let bounce = KeyframeTimeline(initialValue: 0.0) {",
     "    LinearKeyframe(30.0, duration: 0.5)",
     "    LinearKeyframe(0.0, duration: 0.5)",
     "}",
     "for time in [0.0, 0.25, 0.5, 0.75, 1.0] {",
     "    print(time, bounce.value(time: time))",
     "}",
     "print(bounce.duration)"
    ]
   },
   "views": {
    "what": {
     "is": "A keyframe animation moves a value through set values at set times. Each keyframe gives a value to reach, and how long to take to reach it from the keyframe before it. Apple's documentation says that, unlike other animations, keyframes do not go between an old value and a new one from a change of state: they define the whole path that the value takes over time.",
     "marks": [
      {
       "line": 3,
       "text": "initialValue: 0.0",
       "part": "keyframe-start",
       "label": "starts at 0"
      },
      {
       "line": 4,
       "text": "LinearKeyframe(30.0, duration: 0.5)",
       "part": "keyframe",
       "label": "up to 30"
      },
      {
       "line": 5,
       "text": "LinearKeyframe(0.0, duration: 0.5)",
       "part": "keyframe",
       "label": "back to 0"
      }
     ],
     "afterExample": "The timeline `bounce` starts at 0, rises to 30 in half a second, and comes back to 0 in the next half second. Lines 7 to 9 ask it for the value at each quarter of the second.",
     "problem": "Some motion has more than a start and an end, such as a bounce that rises and falls, or a shake that goes left and right several times. A keyframe animation describes each stage, with its value and its time.",
     "how": "A `KeyframeTimeline` holds the keyframes of one value, played one after another from its initial value. A `LinearKeyframe` moves to its value at a steady speed. The method `value(time:)` gives the value at any moment of the timeline. In a view, a modifier plays keyframes each time a value it watches changes, with a track of keyframes for each property it animates, such as a scale and an offset.",
     "when": [
      {
       "text": "Use it for motion with several stages, such as a bounce, a shake, or a pulse when a trip is saved."
      },
      {
       "text": "Don't use it to move a view from one place to another. An animated change of state already goes from the old value to the new one."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "keyframe-start",
       "name": "The initial value, line 3",
       "text": "The argument `initialValue` is where the value starts, at time 0, before the first keyframe: here 0."
      },
      {
       "part": "keyframe",
       "name": "The keyframes, lines 4 and 5",
       "text": "Each `LinearKeyframe` gives a value and a duration. The first goes from 0 to 30 in 0.5 seconds. The second starts where the first ended, and goes back to 0 in 0.5 seconds. Other kinds of keyframe reach their value along a curve, with a spring, or at once."
      }
     ],
     "marks": [
      {
       "line": 3,
       "text": "initialValue: 0.0",
       "part": "keyframe-start",
       "label": "initial value"
      },
      {
       "line": 4,
       "text": "LinearKeyframe(30.0, duration: 0.5)",
       "part": "keyframe",
       "label": "keyframe 1"
      },
      {
       "line": 5,
       "text": "LinearKeyframe(0.0, duration: 0.5)",
       "part": "keyframe",
       "label": "keyframe 2"
      }
     ],
     "steps": [
      {
       "text": "Line 3 makes a timeline that starts at 0, with the two keyframes on lines 4 and 5.",
       "line": 3,
       "also": [
        4,
        5
       ]
      },
      {
       "text": "Line 8 asks for the value at 0 seconds, which is the initial value: {{0.0 0.0}}.",
       "line": 8,
       "also": [
        7
       ],
       "prints": [
        "0.0 0.0"
       ]
      },
      {
       "text": "At 0.25 seconds, halfway through the first keyframe, the value has gone halfway from 0 to 30: {{0.25 15.0}}.",
       "line": 8,
       "also": [
        4
       ],
       "prints": [
        "0.25 15.0"
       ]
      },
      {
       "text": "At 0.5 seconds, the first keyframe ends at its value: {{0.5 30.0}}.",
       "line": 8,
       "also": [
        4
       ],
       "prints": [
        "0.5 30.0"
       ]
      },
      {
       "text": "At 0.75 seconds, the second keyframe is halfway back: {{0.75 15.0}}. At 1 second, it ends at its value: {{1.0 0.0}}.",
       "line": 8,
       "also": [
        5
       ],
       "prints": [
        "0.75 15.0",
        "1.0 0.0"
       ]
      },
      {
       "text": "Line 10 prints the duration of the timeline, the sum of the keyframes' durations: {{1.0}}.",
       "line": 10,
       "prints": [
        "1.0"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The value went up to 30 and back to 0, through each keyframe in turn, at the times the keyframes set."
     }
    }
   }
  },
  "keyframe-start": {
   "id": "keyframe-start",
   "name": "Initial value",
   "first": "The value that a keyframe timeline starts at, at time 0, before its first keyframe.",
   "parts": []
  },
  "keyframe": {
   "id": "keyframe",
   "name": "Keyframe",
   "first": "One stage of a keyframe animation: a value to reach, how long to take, starting where the stage before it ended, and how to get there, such as at a steady speed.",
   "parts": []
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
  "liquid-glass": {
   "id": "liquid-glass",
   "name": "Liquid Glass",
   "area": "ui",
   "first": "The material of iOS 26 and later for bars and controls, which blurs what is behind it, reflects the color and light around it, and reacts to touch.",
   "parts": [
    "glass-effect-modifier"
   ],
   "dependsOn": [
    {
     "id": "material",
     "views": [
      "what"
     ],
     "why": "Liquid Glass is a material, which blurs what is behind it, and also reflects the light and color around it.",
     "whyInExample": "The modifier `glassEffect()` puts glass behind the padded `Text`, as `background(.ultraThinMaterial)` puts a material behind it on the page of Material."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "let label = Text(\"Lima\")",
     "    .padding()",
     "    .glassEffect()",
     "print(type(of: label))"
    ],
    "output": [
     "StaticIf<GlassEnabledPredicate, ModifiedContent<ModifiedContent<Text, _PaddingLayout>, GlassEffectModifier>, ModifiedContent<Text, _PaddingLayout>>"
    ]
   },
   "views": {
    "what": {
     "is": "Liquid Glass is the material that the design of iOS 26 uses for bars and controls. Apple's documentation says that it blurs the content behind it, reflects the color and light of the content around it, and reacts to touch and the pointer as they happen. SwiftUI's own bars and controls use it with no code. The modifier `glassEffect` puts it behind a view of your own.",
     "marks": [
      {
       "line": 5,
       "text": "glassEffect()",
       "part": "glass-effect-modifier",
       "label": "glass behind the view"
      }
     ],
     "afterExample": "The label Lima, with space around it, gets glass behind it. Line 6 prints the type, which has two forms, chosen by {{GlassEnabledPredicate}}: the padded `Text` with the glass, when the glass is enabled, and the padded `Text` alone, when it is not.",
     "problem": "Controls that are drawn over content, such as a button over a map, must be easy to see against what is behind them, without hiding it. Liquid Glass keeps the content visible through the control, and makes custom controls match the system's own.",
     "how": "Apple's documentation says that by default the modifier uses the regular kind of glass, in the shape of a capsule, behind the view's content, and that the glass fills the view's frame, including its padding. A different shape or a tint can be given to it.",
     "when": [
      {
       "text": "Use it for custom controls that are drawn over content, such as a row of buttons over a map, so that they match the system's bars."
      },
      {
       "text": "Don't put glass on content itself, such as the rows of a list, or on glass. It is for the controls that sit over content."
      }
     ]
    }
   }
  },
  "list-row": {
   "id": "list-row",
   "name": "Row",
   "first": "One view in a list's content, which the list draws as one row of its column, in the platform's style.",
   "parts": []
  },
  "list-section": {
   "id": "list-section",
   "name": "Section",
   "first": "A group of rows in a list or a form, under a header and above a footer, which is drawn apart from the other groups.",
   "parts": []
  },
  "list": {
   "id": "list",
   "name": "List",
   "area": "ui",
   "first": "A view that shows rows of data in one scrolling column, grouped in sections, whose rows the user can select, swipe, and delete.",
   "parts": [
    "list-row",
    "list-section"
   ],
   "dependsOn": [
    {
     "id": "for-each",
     "views": [
      "what"
     ],
     "why": "The rows of a list are usually made by a ForEach, one row for each item of data.",
     "whyInExample": "The `ForEach` in the section makes a row for each city, as the `ForEach` on the page of ForEach makes a `Text` for each trip."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "let cities = [\"Lima\", \"Cusco\", \"Oslo\"]",
     "let list = List {",
     "    Section(\"Trips\") {",
     "        ForEach(cities, id: \\.self) { city in",
     "            Text(city)",
     "        }",
     "    }",
     "}",
     "print(type(of: list))"
    ],
    "output": [
     "List<Never, Section<Text, ForEach<Array<String>, String, Text>, EmptyView>>"
    ]
   },
   "views": {
    "what": {
     "is": "A `List` is a view that shows rows in one column that scrolls. Each view in its braces is a row, and a `Section` groups rows under a header. On iOS, the user can tap a row to select it, and swipe it to show buttons, such as Delete.",
     "marks": [
      {
       "line": 5,
       "text": "Section(\"Trips\")",
       "part": "list-section",
       "label": "a section"
      },
      {
       "line": 7,
       "text": "Text(city)",
       "part": "list-row",
       "label": "one row"
      }
     ],
     "afterExample": "The list has one section, with the header Trips, and a row for each city. A program with no window cannot show a list's rows, so line 11 prints the list's type. Its first type, {{Never}}, says that the list has no selection. The section holds a `Text` as its header, the `ForEach` as its rows, and {{EmptyView}} as its footer, because it has none.",
     "problem": "Many screens are a column of rows that can be longer than the screen, such as a list of trips or a screen of settings. A list scrolls, draws each row in the platform's style, with lines between rows, and gives rows the actions that users expect, such as swiping to delete.",
     "how": "Apple's documentation says that a list presents rows of data arranged in a single column, and that it can group rows in sections. It also says that a list asks a `ForEach` inside it for its elements lazily, as it needs them, so a long list does not make every row at once.",
     "when": [
      {
       "text": "Use it for rows of data that the user scrolls, selects, swipes, or deletes, such as the trips of a planner."
      },
      {
       "text": "Don't use it for a layout that is not rows, such as a grid of photos. A lazy grid, or a stack in a scroll view, places views as it is told, and draws no lines between them."
      }
     ]
    }
   }
  },
  "local-value": {
   "id": "local-value",
   "name": "Local constant or variable",
   "first": "A constant or variable declared inside a function's body.",
   "parts": []
  },
  "locale": {
   "id": "locale",
   "name": "Locale",
   "first": "A language and a region, which say how numbers, dates, and prices are written, such as German in Germany.",
   "parts": []
  },
  "localization": {
   "id": "localization",
   "name": "Localization",
   "area": "ui",
   "first": "Showing an app's text, numbers, and prices in each user's language and region, from a catalog with a translation of each string, including its plural forms.",
   "parts": [
    "inflection",
    "locale"
   ],
   "dependsOn": [
    {
     "id": "text",
     "views": [
      "what"
     ],
     "why": "A text's string is a key that SwiftUI looks up in the app's translations.",
     "whyInExample": "The view `Text(\"Lima\")` on the page of Text would look up Lima in the app's string catalog, as `AttributedString(localized:` looks up its string here."
    }
   ],
   "example": {
    "code": [
     "import Foundation",
     "",
     "for count in [1, 3] {",
     "    let text = AttributedString(localized:",
     "        \"^[\\(count) night](inflect: true)\")",
     "    print(String(text.characters))",
     "}",
     "let german = Locale(identifier: \"de_DE\")",
     "let price = 12.5.formatted(",
     "    .currency(code: \"EUR\").locale(german)",
     ")",
     "print(price)"
    ]
   },
   "views": {
    "what": {
     "is": "Localization is showing an app in each user's language and region. Each string that the user reads is a key, which the app looks up in its string catalog, a file with a translation of each string for each language, including the forms that a word takes for one, two, or many. Numbers, dates, and prices are written in the way of the user's region.",
     "marks": [
      {
       "line": 5,
       "text": "inflect: true",
       "part": "inflection",
       "label": "makes the words agree"
      },
      {
       "line": 10,
       "text": "locale(german)",
       "part": "locale",
       "label": "in a region's way"
      }
     ],
     "afterExample": "The same string gives 1 night and 3 nights, because Foundation changes the noun to agree with the number. A price of 12.5 euros is written for Germany as 12,50 €, with a comma and the sign after the number.",
     "problem": "Users read an app in their own language, and expect numbers and prices written the way their region writes them. Writing night and nights, or a dot and a comma, into the code only works for one language. A catalog of translations and formatting for each region make one app right for each user.",
     "how": "Xcode collects the strings of an app into a string catalog, where each language gets its translation, and a plural form for each count where the language needs one. At run time, the app looks up each key in the user's language. For English, the inflection on line 5 makes the noun agree with the number without a catalog. A formatter writes a number for a locale, the language and the region it is for.",
     "when": [
      {
       "text": "Use it for every string the user reads, and format every number, date, and price for the user's locale, even in an app in one language, so the text is right when a language is added."
      },
      {
       "text": "Don't build sentences by joining translated words. Word order and plural forms differ between languages, so translate whole sentences, with the numbers in them."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "inflection",
       "name": "The inflection, line 5",
       "text": "The string marks `\\(count) night` with `inflect: true`. Foundation then changes the words in the brackets to agree with the number: night for 1, and nights for 3. The marks are not shown: only the words are."
      },
      {
       "part": "locale",
       "name": "The locale `german`, line 8",
       "text": "A locale names a language and a region, here German in Germany, `de_DE`. A formatter writes a number for it in the way of that region, such as a comma before the cents, and the euro sign after the number."
      }
     ],
     "marks": [
      {
       "line": 5,
       "text": "inflect: true",
       "part": "inflection",
       "label": "inflection"
      },
      {
       "line": 8,
       "text": "Locale(identifier: \"de_DE\")",
       "part": "locale",
       "label": "locale"
      }
     ],
     "steps": [
      {
       "text": "The loop on line 3 runs first with 1. Lines 4 and 5 look up the string, and make the words in its brackets agree with 1. Line 6 prints {{1 night}}.",
       "line": 6,
       "also": [
        3,
        4,
        5
       ],
       "prints": [
        "1 night"
       ]
      },
      {
       "text": "The loop runs again with 3. The noun now agrees with 3, and line 6 prints {{3 nights}}.",
       "line": 6,
       "also": [
        5
       ],
       "prints": [
        "3 nights"
       ]
      },
      {
       "text": "Line 8 makes the locale of German in Germany. Lines 9 to 11 write 12.5 as a price in euros for that locale.",
       "line": 9,
       "also": [
        8,
        10,
        11
       ]
      },
      {
       "text": "Line 12 prints {{12,50 €}}: a comma before the cents, and the euro sign after the number, with a space that never breaks between them.",
       "line": 12,
       "prints": [
        "12,50 €"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "One string gave the right noun for each number, and one price was written in the way of the user's region."
     }
    }
   }
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
  "make-ui-view": {
   "id": "make-ui-view",
   "name": "Make method",
   "first": "The method of a representable view that makes its UIKit view, which SwiftUI calls once and keeps the view it returns.",
   "parts": []
  },
  "matched-geometry": {
   "id": "matched-geometry",
   "name": "Matched geometry effect",
   "area": "ui",
   "first": "A modifier that links views that share an id, so that when one is removed and another inserted, SwiftUI moves the frame from the old view's place to the new one's.",
   "parts": [
    "namespace",
    "geometry-id"
   ],
   "dependsOn": [
    {
     "id": "transition",
     "views": [
      "what"
     ],
     "why": "The linked views are inserted and removed, and their transitions still say how each one is drawn while the frame moves.",
     "whyInExample": "A second view with the id `\"lima\"` would be inserted as this `Text` is removed, as the `Text` of `Card` is inserted and removed on the page of Transition."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Cards: View {",
     "    @Namespace private var space",
     "    var body: some View {",
     "        Text(\"Lima\")",
     "            .matchedGeometryEffect(",
     "                id: \"lima\", in: space",
     "            )",
     "    }",
     "}",
     "print(type(of: Cards().body))"
    ],
    "output": [
     "ModifiedContent<Text, _MatchedGeometryEffect<String>>"
    ]
   },
   "views": {
    "what": {
     "is": "The modifier `matchedGeometryEffect` links the views that share an id in a namespace. When one of them is removed and another is inserted in the same animated change, SwiftUI moves and resizes the frame from the old view's place to the new view's, so that it looks like one view that moves.",
     "marks": [
      {
       "line": 4,
       "text": "@Namespace private var space",
       "part": "namespace",
       "label": "a namespace"
      },
      {
       "line": 8,
       "text": "id: \"lima\"",
       "part": "geometry-id",
       "label": "the shared id"
      }
     ],
     "afterExample": "In an app, a second view with the id `\"lima\"`, such as a large card, would be inserted as this `Text` is removed, and SwiftUI would move the frame from the small place to the large one. A program with no window draws nothing over time, so line 12 prints the type: the `Text`, with the matched geometry modifier for an id of type {{String}}.",
     "problem": "When a small card opens into a full screen, one view fading out while another fades in does not show that they are the same item. Linking their frames makes the card grow from where it was to where it goes, so the user sees that it is the same item.",
     "how": "Apple's documentation says that if a view is inserted in the same transaction in which another view with the same id is removed, SwiftUI goes between their frames, so that it appears that a single view moves from its old position to its new one. It also says that the modifier links only their geometry: their transitions still say how each of the two views is drawn.",
     "when": [
      {
       "text": "Use it for one item that moves between two layouts, such as a card that opens into a detail view, or a highlight that slides to the chosen tab."
      },
      {
       "text": "Don't give the same id to two views that are both on the screen as the source of the geometry. Apple's documentation says that the result is undefined when more than one view in the group is the source."
      }
     ]
    }
   }
  },
  "material-thickness": {
   "id": "material-thickness",
   "name": "Material thickness",
   "first": "How thick a material is, from ultra thin to ultra thick: the thinner it is, the more of the colors behind it come through.",
   "parts": []
  },
  "material": {
   "id": "material",
   "name": "Material",
   "area": "ui",
   "first": "A see-through background that blurs what is behind a view, whose thickness says how much of the colors behind it come through, and which differs in light and dark appearance.",
   "parts": [
    "material-thickness"
   ],
   "dependsOn": [
    {
     "id": "view-modifier",
     "views": [
      "what"
     ],
     "why": "A material is put behind a view with the background modifier.",
     "whyInExample": "The call `background(.ultraThinMaterial)` is a modifier of the padded `Text`, as `opacity(0.5)` is a modifier of `padded`."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "let label = Text(\"Lima\")",
     "    .padding()",
     "    .background(.ultraThinMaterial)",
     "print(type(of: label))"
    ],
    "output": [
     "ModifiedContent<ModifiedContent<Text, _PaddingLayout>, _BackgroundStyleModifier<Material>>"
    ]
   },
   "views": {
    "what": {
     "is": "A material is a background that blurs what is behind a view, and lets some of its colors through. The modifier `background` puts a material behind a view and its padding. Apple's documentation says that a material is not a view, and that its blur is not plain opacity, but a blend that differs on each platform.",
     "marks": [
      {
       "line": 5,
       "text": "background(.ultraThinMaterial)",
       "label": "blurs what is behind"
      },
      {
       "line": 5,
       "text": ".ultraThinMaterial",
       "part": "material-thickness",
       "label": "its thickness"
      }
     ],
     "afterExample": "The label Lima, with space around it, gets the thinnest material behind it, which lets the most color through. A program with no window has nothing behind the label to blur, so line 6 prints the type: the padded `Text`, with a modifier that draws a material, {{Material}}, behind it.",
     "problem": "Text drawn over a photo or a map can be hard to read, and a solid background behind it hides what is under it. A material keeps the text readable, while the colors and shapes behind it still show through, blurred.",
     "how": "Apple's documentation says that the background modifier puts the material below the view, and blurs the part of the background that the view and its padding cover. How much of the background comes through depends on the material's thickness, and the effect differs between light and dark appearance. Text on a material is drawn in a blend of the colors in front and behind, which keeps it easy to read.",
     "when": [
      {
       "text": "Use a material behind controls or text that sit over content with many colors and shapes, such as a label over a photo or a bar over a map."
      },
      {
       "text": "Don't use a material over a plain background. With nothing to blur, it only changes the color, and a plain color is simpler."
      }
     ]
    }
   }
  },
  "member-binding": {
   "id": "member-binding",
   "name": "Binding to a property",
   "first": "A property's name written after the projected value of a bindable property, which makes a binding to that property of the object.",
   "parts": []
  },
  "memberwise-initializer": {
   "id": "memberwise-initializer",
   "name": "Memberwise initializer",
   "first": "An initializer that swiftc writes for a structure that declares none of its own, with a parameter for its stored properties, each labeled with the property's name.",
   "parts": []
  },
  "model-container-modifier": {
   "id": "model-container-modifier",
   "name": "Model container modifier",
   "first": "The modifier that puts a model container, and a model context for it, in the environment of a view and every view inside it.",
   "parts": []
  },
  "model-container": {
   "id": "model-container",
   "name": "Model container",
   "first": "The object that sets up where SwiftData keeps the models of the types it is given, such as a file on the device, or memory only.",
   "parts": []
  },
  "model-context": {
   "id": "model-context",
   "name": "Model context",
   "area": "ui",
   "first": "The object that inserts, deletes, fetches, and saves SwiftData models, which a view reads from the environment.",
   "parts": [
    "model-container",
    "fetch-descriptor"
   ],
   "dependsOn": [
    {
     "id": "swiftdata-model",
     "views": [
      "what",
      "parts"
     ],
     "why": "A model context saves and fetches instances of SwiftData models.",
     "whyInExample": "The class `Trip` is a model, as `Trip` is on the page of SwiftData model."
    },
    {
     "id": "environment",
     "views": [
      "what"
     ],
     "why": "SwiftUI puts the model context in the environment, where a view reads it."
    },
    {
     "id": "key-path",
     "views": [
      "parts"
     ],
     "why": "A fetch is sorted by a property, named with a key path.",
     "whyInExample": "The value `\\Trip.city` is a key path to `city`, as `\\Trip.nights` is to `nights`."
    }
   ],
   "example": {
    "code": [
     "import SwiftData",
     "import Foundation",
     "",
     "@Model",
     "class Trip {",
     "    var city: String",
     "    init(city: String) {",
     "        self.city = city",
     "    }",
     "}",
     "",
     "let memory = ModelConfiguration(",
     "    isStoredInMemoryOnly: true",
     ")",
     "let container = try ModelContainer(",
     "    for: Trip.self, configurations: memory",
     ")",
     "let context = ModelContext(container)",
     "context.insert(Trip(city: \"Oslo\"))",
     "context.insert(Trip(city: \"Lima\"))",
     "try context.save()",
     "let order = [SortDescriptor(\\Trip.city)]",
     "let request = FetchDescriptor<Trip>(sortBy: order)",
     "let trips = try context.fetch(request)",
     "print(trips.map(\\.city))",
     "context.delete(trips[0])",
     "try context.save()",
     "print(try context.fetchCount(request))"
    ]
   },
   "snippets": {
    "environment": {
     "code": [
      "import SwiftUI",
      "import SwiftData",
      "",
      "@Model",
      "class Trip {",
      "    var city: String",
      "    init(city: String) {",
      "        self.city = city",
      "    }",
      "}",
      "",
      "struct AddButton: View {",
      "    @Environment(\\.modelContext) var context",
      "    var body: some View {",
      "        Button(\"Add\") {",
      "            context.insert(Trip(city: \"Lima\"))",
      "        }",
      "    }",
      "}",
      "print(type(of: AddButton().body))"
     ],
     "output": [
      "Button<Text>"
     ]
    }
   },
   "views": {
    "what": {
     "is": "A model context is the object that changes and reads SwiftData models. Its method `insert` adds a model, `delete` removes one, `fetch` reads the models that a request asks for, and `save` writes the changes to the container's store. A model container says where the models are kept, such as a file on the device.",
     "marks": [
      {
       "line": 18,
       "text": "ModelContext(container)",
       "label": "a model context"
      },
      {
       "line": 15,
       "text": "ModelContainer",
       "part": "model-container",
       "label": "where models are kept"
      },
      {
       "line": 23,
       "text": "FetchDescriptor<Trip>(sortBy: order)",
       "part": "fetch-descriptor",
       "label": "which models to read"
      }
     ],
     "afterExample": "The context inserts two trips, saves them, and fetches them sorted by city: Lima and Oslo. Then it deletes Lima, saves again, and one trip is left. The container here keeps its models in memory only, so the example leaves no file behind.",
     "problem": "An app must add, change, and remove saved data, and read it back in an order. A model context does all of that for SwiftData models, and keeps track of what changed, so that one call saves every change.",
     "how": "The context keeps the models that were inserted, changed, or deleted since the last save. Calling `save` writes those changes to the container's store. Calling `fetch` reads the models that a fetch descriptor describes, in its order. In an app, SwiftUI puts the container's main context in the environment, and a view reads it from there.",
     "when": [
      {
       "text": "Use the context from the environment in a view that adds or deletes models, such as an Add button:",
       "snippet": "environment"
      },
      {
       "text": "Don't fetch with the context to show models in a view. A query fetches them for the view, and updates the view when they change."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "model-container",
       "name": "The container, lines 12 to 17",
       "text": "A `ModelContainer` sets up the store for the model types it is given, here `Trip`. The configuration `memory` keeps the store in memory only, so nothing is written to a file. Line 18 makes a context for the container."
      },
      {
       "part": "fetch-descriptor",
       "name": "The fetch descriptor, lines 22 and 23",
       "text": "A `FetchDescriptor` describes which models to fetch, and in what order. This one asks for every `Trip`, sorted by `city`, which the key path `\\Trip.city` names."
      }
     ],
     "marks": [
      {
       "line": 15,
       "text": "ModelContainer",
       "part": "model-container",
       "label": "container"
      },
      {
       "line": 23,
       "text": "FetchDescriptor<Trip>(sortBy: order)",
       "part": "fetch-descriptor",
       "label": "fetch descriptor"
      }
     ],
     "steps": [
      {
       "text": "Lines 12 to 17 make a container for `Trip` that keeps its store in memory, and line 18 makes a context for it.",
       "line": 18,
       "also": [
        12,
        15
       ]
      },
      {
       "text": "Lines 19 and 20 insert two trips into the context, and line 21 saves them to the store.",
       "line": 21,
       "also": [
        19,
        20
       ]
      },
      {
       "text": "Lines 22 and 23 describe a fetch of every trip, sorted by city. Line 24 fetches them, and line 25 prints their cities: {{[\"Lima\", \"Oslo\"]}}.",
       "line": 25,
       "also": [
        22,
        23,
        24
       ],
       "prints": [
        "[\"Lima\", \"Oslo\"]"
       ]
      },
      {
       "text": "Line 26 deletes the first trip, Lima, and line 27 saves the change.",
       "line": 26,
       "also": [
        27
       ]
      },
      {
       "text": "Line 28 counts the trips that the same request finds: {{1}}.",
       "line": 28,
       "prints": [
        "1"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The context inserted, saved, fetched, and deleted the trips, and each save wrote its changes to the store."
     }
    }
   }
  },
  "model-macro": {
   "id": "model-macro",
   "name": "Model macro",
   "first": "The attached macro written before a class that makes it a SwiftData model, by adding backing data for its values and the code that saving needs.",
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
  "move-to": {
   "id": "move-to",
   "name": "Start of an outline",
   "first": "The point where a path's outline starts, which the path moves to without drawing.",
   "parts": []
  },
  "namespace": {
   "id": "namespace",
   "name": "Namespace",
   "first": "A value, kept by a property marked with the Namespace attribute, that groups the ids of matched views, so that the same id in two namespaces links nothing.",
   "parts": []
  },
  "navigation-destination": {
   "id": "navigation-destination",
   "name": "Navigation destination",
   "first": "A modifier inside a navigation stack that says which screen to show for a value of one type, with a closure that makes the screen from the value.",
   "parts": []
  },
  "navigation-link": {
   "id": "navigation-link",
   "name": "Navigation link",
   "first": "A button inside a navigation stack that pushes the screen for its value when the user taps it.",
   "parts": []
  },
  "navigation-path": {
   "id": "navigation-path",
   "name": "Navigation path",
   "area": "ui",
   "first": "The list of values that a navigation stack shows a screen for, one value for each screen pushed on its root view, so that code pushes a screen by adding a value and goes back by removing one.",
   "parts": [
    "path-argument",
    "path-value"
   ],
   "dependsOn": [
    {
     "id": "navigation-stack",
     "views": [
      "what",
      "parts"
     ],
     "why": "A path is the list of values whose screens a navigation stack pushes on its root view.",
     "whyInExample": "The view `list` is the root view, with a destination for an `Int`, as on the page of Navigation stack."
    },
    {
     "id": "hashable",
     "views": [
      "what",
      "parts"
     ],
     "why": "The values of a path must be hashable.",
     "whyInExample": "The values of `path` are of type `Int`, which is hashable, as `City` is."
    },
    {
     "id": "bindable",
     "views": [
      "parts"
     ],
     "why": "The example keeps its path in an observable class, and gives the stack a binding to it with a bindable property.",
     "whyInExample": "The value `$router.path` is a binding to `path` of the router, as `$trip.nights` is a binding to `nights` of the trip."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "@Observable",
     "class Router {",
     "    var path: [Int] = []",
     "}",
     "",
     "struct TripScreen: View {",
     "    let id: Int",
     "    var body: some View {",
     "        Text(\"Trip \\(id)\")",
     "            .onAppear { print(\"shows trip\", id) }",
     "            .onDisappear {",
     "                print(\"hides trip\", id)",
     "            }",
     "    }",
     "}",
     "",
     "let list = Text(\"All trips\")",
     "    .onAppear { print(\"shows the list\") }",
     "    .navigationDestination(for: Int.self) { id in",
     "        TripScreen(id: id)",
     "    }",
     "",
     "struct Trips: View {",
     "    @Bindable var router: Router",
     "    var body: some View {",
     "        NavigationStack(path: $router.path) {",
     "            list",
     "        }",
     "    }",
     "}",
     "",
     "let router = Router()",
     "let screen = Trips(router: router)",
     "let renderer = ImageRenderer(content: screen)",
     "_ = renderer.cgImage",
     "router.path.append(3)",
     "RunLoop.main.run(until: .now + 0.1)",
     "_ = renderer.cgImage",
     "router.path.append(5)",
     "RunLoop.main.run(until: .now + 0.1)",
     "_ = renderer.cgImage",
     "router.path.removeLast()",
     "RunLoop.main.run(until: .now + 0.1)",
     "_ = renderer.cgImage",
     "print(router.path)"
    ]
   },
   "snippets": {
    "mixed": {
     "code": [
      "import SwiftUI",
      "",
      "var path = NavigationPath()",
      "path.append(3)",
      "path.append(\"Lima\")",
      "print(path.count)"
     ],
     "output": [
      "2"
     ]
    }
   },
   "views": {
    "what": {
     "is": "A navigation stack's path is the list of values whose screens are pushed on its root view, from the bottom up. The stack is given a binding to it, with `path:`. Code that adds a value pushes the screen for that value, and code that removes the last value goes back one screen.",
     "marks": [
      {
       "line": 28,
       "text": "path: $router.path",
       "part": "path-argument",
       "label": "the path"
      },
      {
       "line": 38,
       "text": "append(3)",
       "label": "pushes trip 3"
      },
      {
       "line": 44,
       "text": "removeLast()",
       "label": "goes back"
      }
     ],
     "afterExample": "No one taps anything here. Lines 38 and 41 push the screens of trips 3 and 5 by adding 3 and 5 to the path, and line 44 goes back from trip 5 by removing its value.",
     "problem": "An app often has to show a screen from code, not from a tap: after a trip is saved, from a link that opens the app, or to go back to the first screen. With the path in a value of its own, code pushes and goes back by changing a list.",
     "how": "Apple's documentation says that the stack adds a value to the path as it adds a screen, and removes it when it removes the screen, and that code can change the path to change the screens on the stack. Here the path is a property of an observable class, so any code that has the router can change it.",
     "when": [
      {
       "text": "Use a path for navigation from code, such as going back to the root view after a save, by removing every value. For values of different types, use a `NavigationPath`, which holds values of any hashable type:",
       "snippet": "mixed"
      },
      {
       "text": "Don't add a path to a stack whose screens change only when the user taps. Without one, the stack keeps its path itself."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "path-argument",
       "name": "The path, line 28",
       "text": "The argument `path` of `NavigationStack` is a binding to the list of values whose screens are pushed. Here it is `$router.path`, a binding to `path` of the router, which starts empty."
      },
      {
       "part": "path-value",
       "name": "The values of the path, lines 38 and 41",
       "text": "Each value in the path stands for one pushed screen. The values here are of type `Int`, which is hashable, as every value of a path must be, and the stack makes each screen with the destination for an `Int`."
      }
     ],
     "marks": [
      {
       "line": 28,
       "text": "path: $router.path",
       "part": "path-argument",
       "label": "path"
      },
      {
       "line": 38,
       "text": "3",
       "part": "path-value",
       "label": "a value"
      },
      {
       "line": 41,
       "text": "5",
       "part": "path-value",
       "label": "a value"
      }
     ],
     "steps": [
      {
       "text": "Line 34 makes a `Router`, whose `path` is empty. Lines 35 and 36 make a `Trips` and a renderer, and line 28 gives the stack a binding to `path`.",
       "line": 34,
       "also": [
        35,
        36,
        28
       ]
      },
      {
       "text": "Line 37 asks for the image. The path is empty, so the stack shows only its root view, and line 20 prints {{shows the list}}.",
       "line": 20,
       "also": [
        37
       ],
       "prints": [
        "shows the list"
       ]
      },
      {
       "text": "Line 38 adds 3 to the path. Line 39 runs the main run loop, the loop that does the work waiting on the main thread, and line 40 draws again. The stack pushes the screen for 3, and line 12 prints {{shows trip 3}}.",
       "line": 12,
       "also": [
        38,
        39,
        40
       ],
       "prints": [
        "shows trip 3"
       ]
      },
      {
       "text": "Line 41 adds 5, and lines 42 and 43 draw again. The stack pushes the screen for 5 on top, and line 12 prints {{shows trip 5}}.",
       "line": 12,
       "also": [
        41,
        42,
        43
       ],
       "prints": [
        "shows trip 5"
       ]
      },
      {
       "text": "Line 44 removes the last value, 5, and lines 45 and 46 draw again. The stack removes the screen of trip 5, as its back button would, and line 14 prints {{hides trip 5}}.",
       "line": 14,
       "also": [
        44,
        45,
        46
       ],
       "prints": [
        "hides trip 5"
       ]
      },
      {
       "text": "Line 47 prints the path: {{[3]}}. The screen of trip 3 is on top again.",
       "line": 47,
       "prints": [
        "[3]"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "Adding a value to the path pushed its screen, and removing the last value went back one screen, with no tap."
     }
    }
   }
  },
  "navigation-stack": {
   "id": "navigation-stack",
   "name": "Navigation stack",
   "area": "ui",
   "first": "A view that shows a first screen, and the screens pushed on top of it one after another, with a back button that goes back one screen.",
   "parts": [
    "root-view",
    "navigation-link",
    "navigation-destination"
   ],
   "dependsOn": [
    {
     "id": "view-modifier",
     "views": [
      "what",
      "parts"
     ],
     "why": "A navigation stack learns which screen to show for a value from a modifier on a view inside it.",
     "whyInExample": "The call `navigationDestination(for:)` is a modifier of the link, as `padding(8)` is a modifier of `city`."
    },
    {
     "id": "binding",
     "views": [
      "parts"
     ],
     "why": "A navigation stack can be given a binding to the list of values whose screens it shows.",
     "whyInExample": "The value `$path` is a binding to the state `path`, as `$nights` is a binding to `nights` on the page of Binding."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct TripScreen: View {",
     "    let id: Int",
     "    var body: some View {",
     "        Text(\"Trip \\(id)\")",
     "            .onAppear { print(\"shows trip\", id) }",
     "    }",
     "}",
     "",
     "let list = NavigationLink(\"Trip 1\", value: 1)",
     "    .onAppear { print(\"shows the list\") }",
     "    .navigationDestination(for: Int.self) { id in",
     "        TripScreen(id: id)",
     "    }",
     "",
     "struct Trips: View {",
     "    @State private var path = [1]",
     "    var body: some View {",
     "        NavigationStack(path: $path) {",
     "            list",
     "        }",
     "    }",
     "}",
     "",
     "let renderer = ImageRenderer(content: Trips())",
     "_ = renderer.cgImage"
    ]
   },
   "views": {
    "what": {
     "is": "A `NavigationStack` is a view that shows a first screen, its root view, and screens pushed on top of it. It shows only the top screen, with a back button that goes back one screen. A `NavigationLink` pushes a screen when the user taps it, and the modifier `navigationDestination(for:)` says which screen to show for each value.",
     "marks": [
      {
       "line": 21,
       "text": "list",
       "part": "root-view",
       "label": "the first screen"
      },
      {
       "line": 11,
       "text": "NavigationLink(\"Trip 1\", value: 1)",
       "part": "navigation-link",
       "label": "pushes trip 1"
      },
      {
       "line": 13,
       "text": "navigationDestination(for: Int.self)",
       "part": "navigation-destination",
       "label": "the screen for a number"
      }
     ],
     "afterExample": "The stack starts with the value 1 already pushed, as if the user had tapped the link, so it makes the list and then the screen of trip 1 on top of it.",
     "problem": "Most apps go from a list to the details of one item, and from there deeper, and the user must be able to go back the same way. A navigation stack keeps the screens in order, shows the newest one, and gives each screen a way back.",
     "how": "A navigation stack keeps a list of values, one for each screen pushed on top of its root view. Tapping a link adds its value to the list. For each value, the stack finds the destination for the value's type, and calls its closure with the value to make the screen. Apple's documentation says that the stack always shows the most recently added screen, never removes the root view, and removes a value from the list when the user goes back.",
     "when": [
      {
       "text": "Use it for screens that go deeper, one from another, such as a list of trips, then one trip, then one day of it."
      },
      {
       "text": "Don't use it to move between the main areas of an app, which the user switches between at any time. A tab view shows those side by side, in a tab bar."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "root-view",
       "name": "The root view `list`, line 21",
       "text": "The braces of `NavigationStack` hold its root view, the first screen, which is always at the bottom of the stack. Here it is `list`, which lines 11 to 15 make."
      },
      {
       "part": "navigation-link",
       "name": "The link, line 11",
       "text": "A `NavigationLink` shows its title, Trip 1, as a button. When the user taps it, it pushes the screen for its value, 1. This program has no user, so nothing taps it."
      },
      {
       "part": "navigation-destination",
       "name": "The destination, lines 13 to 15",
       "text": "The modifier `navigationDestination(for:)` says which screen the stack shows for a value of the type `Int`. The stack calls its closure with the value, here as `id`, and the closure returns a `TripScreen` for it."
      }
     ],
     "marks": [
      {
       "line": 21,
       "text": "list",
       "part": "root-view",
       "label": "root view"
      },
      {
       "line": 11,
       "text": "NavigationLink(\"Trip 1\", value: 1)",
       "part": "navigation-link",
       "label": "link"
      },
      {
       "line": 13,
       "text": "navigationDestination(for: Int.self)",
       "part": "navigation-destination",
       "label": "destination"
      }
     ],
     "steps": [
      {
       "text": "Line 26 makes a `Trips` and a renderer, and line 27 asks for its image. The state `path` is a list of the values whose screens are pushed, and starts with one value, 1. Line 20 gives the stack a binding to it.",
       "line": 27,
       "also": [
        26,
        18,
        20
       ]
      },
      {
       "text": "The stack shows its root view first, at the bottom, and line 12 prints {{shows the list}}.",
       "line": 12,
       "also": [
        21
       ],
       "prints": [
        "shows the list"
       ]
      },
      {
       "text": "For the value 1 in `path`, the stack finds the destination for an `Int`, and calls its closure with 1, which makes a `TripScreen` whose `id` is 1.",
       "line": 14,
       "also": [
        13
       ]
      },
      {
       "text": "That screen is pushed on top of the list, and line 7 prints {{shows trip 1}}.",
       "line": 7,
       "prints": [
        "shows trip 1"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The stack showed its root view, and pushed on top of it the screen that its destination made for the value 1."
     }
    }
   }
  },
  "observable-macro": {
   "id": "observable-macro",
   "name": "Observable macro",
   "first": "The attached macro written before a class that makes it observable, by adding the code that reports each read and each change of its stored properties.",
   "parts": []
  },
  "observable-object": {
   "id": "observable-object",
   "name": "Observable object",
   "area": "ui",
   "first": "How a class told SwiftUI that it changed before iOS 17: it sent one signal before any of its published properties changed, and every view that observed it ran its body again.",
   "parts": [
    "conformance",
    "published-property",
    "observed-object-property"
   ],
   "dependsOn": [
    {
     "id": "observable",
     "views": [
      "what",
      "parts"
     ],
     "why": "An observable object does what an observable class does, in the way it was done before iOS 17, and updates more views.",
     "whyInExample": "This is the example of the page of Observable, with `ObservableObject` and `@Published` in place of the macro `@Observable`."
    },
    {
     "id": "property-wrapper",
     "views": [
      "parts"
     ],
     "why": "A published property and an observed object are wrapped properties of property wrappers.",
     "whyInExample": "The attributes `@Published` and `@ObservedObject` name property wrappers, as `@AtMostTen` is."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "class Trip: ObservableObject {",
     "    @Published var nights = 3",
     "    @Published var city = \"Lima\"",
     "}",
     "",
     "struct NightsLabel: View {",
     "    @ObservedObject var trip: Trip",
     "    var body: some View {",
     "        let _ = print(\"body runs:\", trip.nights)",
     "        Text(\"\\(trip.nights) nights\")",
     "    }",
     "}",
     "",
     "let trip = Trip()",
     "let label = NightsLabel(trip: trip)",
     "let renderer = ImageRenderer(content: label)",
     "_ = renderer.cgImage",
     "trip.city = \"Oslo\"",
     "RunLoop.main.run(until: .now + 0.1)",
     "trip.nights = 5",
     "RunLoop.main.run(until: .now + 0.1)"
    ]
   },
   "views": {
    "what": {
     "is": "An observable object is a class that conforms to the protocol `ObservableObject`. Before iOS 17, it was how a class told SwiftUI that it changed. Setting a property marked `@Published` makes the object send one signal, and a view that holds the object with `@ObservedObject` runs its `body` again after each signal, whichever property changed.",
     "marks": [
      {
       "line": 3,
       "text": "ObservableObject",
       "part": "conformance",
       "label": "observable object"
      },
      {
       "line": 4,
       "text": "@Published",
       "part": "published-property",
       "label": "sends the signal"
      },
      {
       "line": 9,
       "text": "@ObservedObject",
       "part": "observed-object-property",
       "label": "gets the signal"
      }
     ],
     "afterExample": "The `body` of `NightsLabel` reads only `nights`. Line 20 changes `city`, and the `body` still runs again, because the object sends the same signal for every change.",
     "problem": "SwiftUI must know when a shared class changes. Before iOS 17, which added observable classes, a class told it with this protocol. Much code written before then still uses it, so a Swift developer still meets it.",
     "how": "Apple's documentation says that an observable object has a publisher that sends a signal before any of its published properties changes. A publisher is a value that sends signals to the code that subscribes to it. The attribute `@ObservedObject` subscribes the view, and SwiftUI runs its `body` again after each signal. The signal does not say which property changed.",
     "when": [
      {
       "text": "Use it in an app that must run on iOS 16 or earlier, and expect it in code written before iOS 17."
      },
      {
       "text": "Don't use it in new code for iOS 17 or later. An observable class updates only the views that read the property that changed, where an observable object updates every view that observes it."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "conformance",
       "name": "The conformance to `ObservableObject`, line 3",
       "text": "The colon and the name `ObservableObject` after `Trip` say that `Trip` conforms to the protocol `ObservableObject`. Apple's documentation says the protocol gives each instance a publisher that sends a signal before any of its published properties changes, so `Trip` needs no code of its own for it."
      },
      {
       "part": "published-property",
       "name": "The published properties, lines 4 and 5",
       "text": "The attribute `@Published` makes `nights` and `city` wrapped properties of `Published`, a property wrapper. Setting either one makes the object send its signal, before the new value is stored. The signal is the same for both."
      },
      {
       "part": "observed-object-property",
       "name": "The observed object `trip`, line 9",
       "text": "The attribute `@ObservedObject` makes `trip` a wrapped property of `ObservedObject`, a property wrapper that SwiftUI provides. SwiftUI subscribes the view to the signal of the object it holds, and runs its `body` again after each signal."
      }
     ],
     "marks": [
      {
       "line": 3,
       "text": "ObservableObject",
       "part": "conformance",
       "label": "conformance"
      },
      {
       "line": 4,
       "text": "@Published",
       "part": "published-property",
       "label": "published"
      },
      {
       "line": 5,
       "text": "@Published",
       "part": "published-property",
       "label": "published"
      },
      {
       "line": 9,
       "text": "@ObservedObject",
       "part": "observed-object-property",
       "label": "observed object"
      }
     ],
     "steps": [
      {
       "text": "Line 16 makes a `Trip`, line 17 makes a `NightsLabel` that observes it, and line 18 makes a renderer for the label.",
       "line": 16,
       "also": [
        17,
        18
       ]
      },
      {
       "text": "Line 19 asks for the image, so SwiftUI runs the `body` of `NightsLabel`, and line 11 prints {{body runs: 3}}.",
       "line": 11,
       "also": [
        19
       ],
       "prints": [
        "body runs: 3"
       ]
      },
      {
       "text": "Line 20 changes `city`. Its property wrapper makes the object send its signal, before the change.",
       "line": 20,
       "also": [
        5
       ]
      },
      {
       "text": "Line 21 runs the main run loop, the loop that does the work waiting on the main thread. SwiftUI got the signal, which does not say which property changed, so it runs the `body` again, though the `body` never read `city`. Line 11 prints {{body runs: 3}}.",
       "line": 11,
       "also": [
        21
       ],
       "prints": [
        "body runs: 3"
       ]
      },
      {
       "text": "Line 22 changes `nights` to 5, which sends the same signal.",
       "line": 22,
       "also": [
        4
       ]
      },
      {
       "text": "Line 23 runs the main run loop, and SwiftUI runs the `body` again. Line 11 prints {{body runs: 5}}.",
       "line": 11,
       "also": [
        23
       ],
       "prints": [
        "body runs: 5"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The object sent the same signal for each change, so SwiftUI ran the `body` again for `city` as well as for `nights`."
     }
    }
   }
  },
  "observable": {
   "id": "observable",
   "name": "Observable",
   "area": "ui",
   "first": "A class whose stored properties report each read and each change, so that SwiftUI runs again the body of each view that read a property that changed.",
   "parts": [
    "observable-macro",
    "tracked-property",
    "body-dependency"
   ],
   "dependsOn": [
    {
     "id": "class",
     "views": [
      "what",
      "parts"
     ],
     "why": "An observable type is a class, so every view that uses one instance sees the same values.",
     "whyInExample": "The type `Trip` is a class, as `Counter` is, and `NightsLabel` holds a reference to the one `trip`."
    },
    {
     "id": "macro",
     "views": [
      "what",
      "parts"
     ],
     "why": "A class becomes observable through a macro, which adds the code that reports each read and each change.",
     "whyInExample": "The attribute `@Observable` is an attached macro, as `#function` on the page of Macro is a freestanding one."
    },
    {
     "id": "view-update",
     "views": [
      "what",
      "parts"
     ],
     "why": "SwiftUI runs a body again only when a value that the body read changes, and an observable class reports which of its properties a body read.",
     "whyInExample": "The body of `NightsLabel` reads `trip.nights`, as the body of `Counter` on the page of View update reads `taps`."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "@Observable",
     "class Trip {",
     "    var nights = 3",
     "    var city = \"Lima\"",
     "}",
     "",
     "struct NightsLabel: View {",
     "    let trip: Trip",
     "    var body: some View {",
     "        let _ = print(\"body runs:\", trip.nights)",
     "        Text(\"\\(trip.nights) nights\")",
     "    }",
     "}",
     "",
     "let trip = Trip()",
     "let label = NightsLabel(trip: trip)",
     "let renderer = ImageRenderer(content: label)",
     "_ = renderer.cgImage",
     "trip.city = \"Oslo\"",
     "RunLoop.main.run(until: .now + 0.1)",
     "trip.nights = 5",
     "RunLoop.main.run(until: .now + 0.1)"
    ],
    "sil": [
     {
      "in": "Trip.nights.getter",
      "has": "#Trip.access",
      "shows": "The macro makes nights a computed property, whose getter reports each read by calling access(keyPath:) with a key path to nights."
     },
     {
      "in": "Trip.nights.getter",
      "has": "#Trip._nights",
      "shows": "The getter reads the value from _nights, a stored property that the macro adds."
     },
     {
      "in": "Trip.nights.setter",
      "has": "#Trip.withMutation",
      "shows": "The setter reports each change by calling withMutation(keyPath:_:), which makes the change."
     }
    ]
   },
   "views": {
    "what": {
     "is": "An observable class is a class marked with the macro `@Observable`. The macro makes each stored property report when code reads it and when code changes it. SwiftUI notes which properties each view's `body` read, and when one of those properties changes, it runs that `body` again.",
     "marks": [
      {
       "line": 3,
       "text": "@Observable",
       "part": "observable-macro",
       "label": "observable"
      },
      {
       "line": 12,
       "text": "trip.nights",
       "part": "body-dependency",
       "label": "read by body"
      }
     ],
     "afterExample": "The `body` of `NightsLabel` reads `nights`, and never reads `city`. So line 21, which changes `city`, runs no `body`, and line 23, which changes `nights`, runs it again.",
     "problem": "Data that several views share, such as a trip that a list and an editor both show, cannot be state, because state belongs to one view. A class can be shared, but SwiftUI has no way to see a change to a plain class. An observable class reports its changes, and SwiftUI updates only the views that read what changed.",
     "how": "The macro turns each stored property into a computed property, and keeps the value in a stored property of its own. Its getter reports the read, with a key path to the property, and its setter reports the change. While SwiftUI runs a `body`, it collects the reads. When a property it collected changes, it runs that `body` again.",
     "when": [
      {
       "text": "Use it for the data of an app that several views read and change, such as a store of trips, on iOS 17 or later."
      },
      {
       "text": "Don't use it for a value that only one view uses, such as whether a menu is open. A state property is simpler."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "observable-macro",
       "name": "The macro `@Observable`, line 3",
       "text": "An attached macro written before the class. When swiftc builds the program, it adds code to `Trip`: a stored property that keeps the value of each property, and code that reports each read and each change."
      },
      {
       "part": "tracked-property",
       "name": "The tracked properties, lines 5 and 6",
       "text": "The properties `nights` and `city` are written as plain stored properties. The macro makes each one a computed property that reports each read and each change, and keeps its value in a stored property that the macro adds."
      },
      {
       "part": "body-dependency",
       "name": "The read of `trip.nights`, line 12",
       "text": "The `body` of `NightsLabel` reads `nights` on lines 12 and 13. Each read reports itself, so SwiftUI notes that this `body` depends on `nights` of this trip, and not on `city`."
      }
     ],
     "marks": [
      {
       "line": 3,
       "text": "@Observable",
       "part": "observable-macro",
       "label": "macro"
      },
      {
       "line": 5,
       "text": "var nights = 3",
       "part": "tracked-property",
       "label": "tracked"
      },
      {
       "line": 6,
       "text": "var city = \"Lima\"",
       "part": "tracked-property",
       "label": "tracked"
      },
      {
       "line": 12,
       "text": "trip.nights",
       "part": "body-dependency",
       "label": "read by body"
      },
      {
       "line": 13,
       "text": "trip.nights",
       "part": "body-dependency",
       "label": "read by body"
      }
     ],
     "steps": [
      {
       "text": "Line 17 makes a `Trip`, and line 18 makes a `NightsLabel` that holds a reference to it. Line 19 makes a renderer for the label.",
       "line": 17,
       "also": [
        18,
        19
       ]
      },
      {
       "text": "Line 20 asks for the image, so SwiftUI runs the `body` of `NightsLabel`. Line 12 reads `trip.nights`, which reports the read, and prints {{body runs: 3}}.",
       "line": 12,
       "also": [
        20
       ],
       "prints": [
        "body runs: 3"
       ]
      },
      {
       "text": "Line 21 changes `city`, which reports the change. No `body` read `city`, so SwiftUI has nothing to update. Line 22 runs the main run loop, the loop that does the work waiting on the main thread, for a tenth of a second, and no `body` runs.",
       "line": 21,
       "also": [
        22
       ]
      },
      {
       "text": "Line 23 changes `nights` to 5. The `body` of `NightsLabel` read `nights`, so SwiftUI marks that view to update.",
       "line": 23
      },
      {
       "text": "Line 24 runs the main run loop, where SwiftUI does its waiting updates. It runs the `body` again, and line 12 prints {{body runs: 5}}.",
       "line": 12,
       "also": [
        24
       ],
       "prints": [
        "body runs: 5"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The class reported each read and each change. SwiftUI ran the `body` again for the change to `nights`, which it read, and not for `city`."
     }
    }
   }
  },
  "observed-object-property": {
   "id": "observed-object-property",
   "name": "Observed object property",
   "first": "A property of a view marked with the ObservedObject attribute, which holds an observable object and makes SwiftUI run the view's body again after each signal that the object sends.",
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
  "path-argument": {
   "id": "path-argument",
   "name": "Path argument",
   "first": "The argument of a navigation stack that gives it a binding to its path, so that code can read and change which screens are pushed.",
   "parts": []
  },
  "path-in-rect": {
   "id": "path-in-rect",
   "name": "Outline method",
   "first": "The method that every shape must have, which gets the rectangle that the shape is drawn in and returns the shape's outline for it.",
   "parts": []
  },
  "path-value": {
   "id": "path-value",
   "name": "Value of a path",
   "first": "One hashable value in a navigation stack's path, which stands for one pushed screen, made by the destination for the value's type.",
   "parts": []
  },
  "path": {
   "id": "path",
   "name": "Path",
   "area": "ui",
   "first": "The outline of a flat shape, made of lines and curves between points, which can be filled or stroked.",
   "parts": [
    "move-to",
    "add-line",
    "close-subpath"
   ],
   "dependsOn": [
    {
     "id": "view",
     "views": [
      "what"
     ],
     "why": "A path is also a view, so it can be shown on the screen, filled with a color or stroked with a line.",
     "whyInExample": "The path `path` could be shown on the screen as `Greeting` is, because a path is a view."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "var path = Path()",
     "path.move(to: CGPoint(x: 0, y: 0))",
     "path.addLine(to: CGPoint(x: 40, y: 0))",
     "path.addLine(to: CGPoint(x: 40, y: 30))",
     "path.closeSubpath()",
     "print(path.boundingRect)",
     "print(path.contains(CGPoint(x: 30, y: 5)))",
     "print(path.contains(CGPoint(x: 5, y: 25)))"
    ]
   },
   "views": {
    "what": {
     "is": "A `Path` is the outline of a flat shape, made of lines and curves between points. Code builds it one piece at a time: it moves to the point where the outline starts, adds lines or curves to the next points, and can close the outline with a line back to the start. Apple's documentation calls it the outline of a 2D shape.",
     "marks": [
      {
       "line": 4,
       "text": "move(to: CGPoint(x: 0, y: 0))",
       "part": "move-to",
       "label": "starts here"
      },
      {
       "line": 5,
       "text": "addLine(to: CGPoint(x: 40, y: 0))",
       "part": "add-line",
       "label": "a line"
      },
      {
       "line": 7,
       "text": "closeSubpath()",
       "part": "close-subpath",
       "label": "closes it"
      }
     ],
     "afterExample": "The path is a triangle with corners at (0, 0), (40, 0), and (40, 30). Its smallest bounding rectangle is 40 by 30, and the point (30, 5) is inside it, while (5, 25) is not.",
     "problem": "Not every drawing is a rectangle or a circle, such as a pennant, a speech bubble, or the line of a chart. A path draws any outline from points, lines, and curves.",
     "how": "Each call adds to the outline from the current point, the end of the last piece. In SwiftUI, x grows to the right and y grows down, from the top leading corner. A path is also a view, so it can be shown, filled with a color, or stroked with a line of a given width.",
     "when": [
      {
       "text": "Use a path for an outline made of points, such as a triangle or the line of a chart, and inside a shape, which draws its path at any size."
      },
      {
       "text": "Don't use a path for a rectangle, a circle, or a capsule. SwiftUI has shapes for those, which already fit any size."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "move-to",
       "name": "The start, line 4",
       "text": "The method `move(to:)` sets the point where the outline starts, here (0, 0), the top leading corner. It draws nothing by itself."
      },
      {
       "part": "add-line",
       "name": "The lines, lines 5 and 6",
       "text": "The method `addLine(to:)` adds a straight line from the current point to the point it is given, which becomes the current point. Line 5 draws along the top to (40, 0), and line 6 down to (40, 30)."
      },
      {
       "part": "close-subpath",
       "name": "The close, line 7",
       "text": "The method `closeSubpath()` adds a line from the current point back to the start, so the outline is closed and has an inside."
      }
     ],
     "marks": [
      {
       "line": 4,
       "text": "move(to: CGPoint(x: 0, y: 0))",
       "part": "move-to",
       "label": "start"
      },
      {
       "line": 5,
       "text": "addLine(to: CGPoint(x: 40, y: 0))",
       "part": "add-line",
       "label": "line"
      },
      {
       "line": 6,
       "text": "addLine(to: CGPoint(x: 40, y: 30))",
       "part": "add-line",
       "label": "line"
      },
      {
       "line": 7,
       "text": "closeSubpath()",
       "part": "close-subpath",
       "label": "close"
      }
     ],
     "steps": [
      {
       "text": "Line 3 makes an empty path, and line 4 moves to (0, 0), where the outline starts.",
       "line": 4,
       "also": [
        3
       ]
      },
      {
       "text": "Line 5 adds a line along the top to (40, 0), and line 6 adds a line down to (40, 30).",
       "line": 5,
       "also": [
        6
       ]
      },
      {
       "text": "Line 7 closes the outline with a line back to (0, 0). The path is a triangle.",
       "line": 7
      },
      {
       "text": "Line 8 prints the smallest rectangle that holds the path: its corner at x 0 and y 0, 40 wide and 30 tall: {{(0.0, 0.0, 40.0, 30.0)}}.",
       "line": 8,
       "prints": [
        "(0.0, 0.0, 40.0, 30.0)"
       ]
      },
      {
       "text": "Line 9 asks whether the point (30, 5), near the top right, is inside the outline. It is: {{true}}.",
       "line": 9,
       "prints": [
        "true"
       ]
      },
      {
       "text": "Line 10 asks about (5, 25), near the bottom left, which is outside the triangle: {{false}}.",
       "line": 10,
       "prints": [
        "false"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "Three calls drew a triangle from its corners, and closing it gave the outline an inside that the path can be asked about."
     }
    }
   }
  },
  "persisted-property": {
   "id": "persisted-property",
   "name": "Saved property",
   "first": "A stored property of a SwiftData model, which the macro turns into a computed property that reads and writes the model's backing data, and which is saved with the model.",
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
  "published-property": {
   "id": "published-property",
   "name": "Published property",
   "first": "A property of an observable object marked with the Published attribute, whose every change makes the object send its signal, before the new value is stored.",
   "parts": []
  },
  "pull-to-refresh": {
   "id": "pull-to-refresh",
   "name": "Pull to refresh",
   "area": "ui",
   "first": "A modifier that lets the user pull a list down to run an async closure that loads its data again, with a spinner until the closure returns.",
   "parts": [
    "refreshable-modifier",
    "refresh-action"
   ],
   "dependsOn": [
    {
     "id": "list",
     "views": [
      "what"
     ],
     "why": "A list on iOS offers the pull, and shows the spinner, when it is given a refresh action.",
     "whyInExample": "In an app, `Puller` would be a list, as `list` is on the page of List."
    },
    {
     "id": "environment",
     "views": [
      "what",
      "parts"
     ],
     "why": "The modifier puts the refresh action in the environment, where the list reads it.",
     "whyInExample": "The property `@Environment(\\.refresh)` reads the action, as `@Environment(\\.isEnabled)` reads whether views are enabled."
    },
    {
     "id": "task-modifier",
     "views": [
      "parts"
     ],
     "why": "The example calls the refresh action from a task, which can wait for it.",
     "whyInExample": "The closure of `task` on line 13 runs in a task, as the one on the page of Task modifier does."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "func reload() async {",
     "    print(\"reloading\")",
     "    try? await Task.sleep(for: .milliseconds(50))",
     "    print(\"reloaded\")",
     "}",
     "",
     "struct Puller: View {",
     "    @Environment(\\.refresh) private var refresh",
     "    var body: some View {",
     "        Text(\"Trips\")",
     "            .task {",
     "                await refresh?()",
     "                print(\"spinner hides\")",
     "            }",
     "    }",
     "}",
     "",
     "let trips = Puller()",
     "    .refreshable { await reload() }",
     "_ = ImageRenderer(content: trips).cgImage",
     "RunLoop.main.run(until: .now + 0.2)"
    ]
   },
   "views": {
    "what": {
     "is": "Pull to refresh lets the user drag a list down to load its data again. The modifier `refreshable` gives it an async closure. Apple's documentation says that a list on iOS then offers the standard pull to refresh: when the user drags the top of the list down, it shows a spinner and runs the closure, and the spinner stays until the closure returns.",
     "marks": [
      {
       "line": 21,
       "text": "refreshable { await reload() }",
       "part": "refreshable-modifier",
       "label": "what a pull runs"
      },
      {
       "line": 14,
       "text": "await refresh?()",
       "part": "refresh-action",
       "label": "what a pull does"
      }
     ],
     "afterExample": "No one pulls here, so `Puller` does what a list does when the user pulls: it reads the refresh action from the environment, and calls it with `await`. Line 15 runs only after `reload()` has returned, which is when a list hides its spinner.",
     "problem": "Data in a list can change somewhere else, such as trips edited on another device. Users expect to pull a list down to get the newest data, and to see a spinner while it loads. The modifier gives a list that behavior with one closure.",
     "how": "Apple's documentation says that `refreshable` sets the refresh value in the view's environment to an action that runs the closure, and that views that find the action there, such as a list, offer a way to refresh. The action is async, so the view that calls it waits with `await`, and knows that the refresh is done when the call returns.",
     "when": [
      {
       "text": "Use it on a list or a scroll view whose data can be loaded again, such as trips kept on a server."
      },
      {
       "text": "Don't use it for data that only this device changes. That data is always up to date, so there is nothing to load again."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "refreshable-modifier",
       "name": "The modifier `refreshable`, line 21",
       "text": "The modifier puts a refresh action in the environment of `Puller`, and of every view inside it. The action runs the closure after `refreshable`, which calls `reload()`."
      },
      {
       "part": "refresh-action",
       "name": "The refresh action `refresh`, line 10",
       "text": "The property `refresh` reads that action from the environment. Where no view put one, it is nil, so line 14 calls it with a question mark, which calls it only when it is there."
      }
     ],
     "marks": [
      {
       "line": 21,
       "text": "refreshable",
       "part": "refreshable-modifier",
       "label": "modifier"
      },
      {
       "line": 10,
       "text": "@Environment(\\.refresh) private var refresh",
       "part": "refresh-action",
       "label": "refresh action"
      }
     ],
     "steps": [
      {
       "text": "Lines 20 and 21 make a `Puller` with a refresh action, and line 22 draws it.",
       "line": 22,
       "also": [
        20,
        21
       ]
      },
      {
       "text": "Before the `Text` appears, its task starts. Line 14 calls the refresh action, as a list does when the user pulls, and waits.",
       "line": 14,
       "also": [
        13
       ]
      },
      {
       "text": "The action runs the closure on line 21, which calls `reload()`, and line 4 prints {{reloading}}.",
       "line": 4,
       "also": [
        21
       ],
       "prints": [
        "reloading"
       ]
      },
      {
       "text": "Line 5 suspends for 50 milliseconds, while line 23 runs the main run loop. Then line 6 prints {{reloaded}}, and `reload()` returns.",
       "line": 6,
       "also": [
        5,
        23
       ],
       "prints": [
        "reloaded"
       ]
      },
      {
       "text": "The call on line 14 returns, so line 15 prints {{spinner hides}}, as a list hides its spinner at that moment.",
       "line": 15,
       "also": [
        14
       ],
       "prints": [
        "spinner hides"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The view that calls the refresh action waits until the closure has finished, so it knows how long to show the spinner."
     }
    }
   }
  },
  "query-property": {
   "id": "query-property",
   "name": "Query property",
   "first": "A property of a view marked with the Query attribute, whose value is the array of models that the query fetched, in the order it is given.",
   "parts": []
  },
  "query": {
   "id": "query",
   "name": "Query",
   "area": "ui",
   "first": "A property wrapper that fetches SwiftData models for a view, and fetches again, and updates the view, when those models change.",
   "parts": [
    "query-property",
    "model-container-modifier"
   ],
   "dependsOn": [
    {
     "id": "model-context",
     "views": [
      "what",
      "parts"
     ],
     "why": "A query fetches models with the model context in the view's environment.",
     "whyInExample": "The property `container.mainContext` is a model context, as `context` is on the page of Model context."
    },
    {
     "id": "view-update",
     "views": [
      "parts"
     ],
     "why": "When the query's result changes, SwiftUI runs the body that read it again.",
     "whyInExample": "The `body` of `TripList` reads `trips`, as the `body` of `Counter` reads `taps` on the page of View update."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "import SwiftData",
     "",
     "@Model",
     "class Trip {",
     "    var city: String",
     "    init(city: String) {",
     "        self.city = city",
     "    }",
     "}",
     "",
     "struct TripList: View {",
     "    @Query(sort: \\Trip.city) var trips: [Trip]",
     "    var body: some View {",
     "        let _ = print(\"shows\", trips.map(\\.city))",
     "        Text(\"\\(trips.count) trips\")",
     "    }",
     "}",
     "",
     "let memory = ModelConfiguration(",
     "    isStoredInMemoryOnly: true",
     ")",
     "let container = try ModelContainer(",
     "    for: Trip.self, configurations: memory",
     ")",
     "let context = container.mainContext",
     "context.insert(Trip(city: \"Oslo\"))",
     "context.insert(Trip(city: \"Lima\"))",
     "let screen = TripList().modelContainer(container)",
     "let renderer = ImageRenderer(content: screen)",
     "_ = renderer.cgImage",
     "context.insert(Trip(city: \"Cusco\"))",
     "RunLoop.main.run(until: .now + 0.1)",
     "_ = renderer.cgImage"
    ],
    "sil": [
     {
      "in": "TripList.trips.getter",
      "has": "#TripList._trips",
      "shows": "Reading trips reads _trips, the Query that swiftc stores for the wrapped property."
     }
    ]
   },
   "views": {
    "what": {
     "is": "A property marked `@Query` fetches SwiftData models for a view, with the model context in the view's environment. The `body` reads the result as an array. Apple's documentation says that a query manages the models it fetched, so that they stay the same as the saved data: when matching models are inserted, changed, or deleted, the view gets the new result.",
     "marks": [
      {
       "line": 13,
       "text": "@Query(sort: \\Trip.city) var trips: [Trip]",
       "part": "query-property",
       "label": "fetches trips"
      },
      {
       "line": 29,
       "text": "modelContainer(container)",
       "part": "model-container-modifier",
       "label": "where to fetch"
      }
     ],
     "afterExample": "The view `TripList` shows its trips, sorted by city. When line 32 inserts Cusco, the query's result changes, and the `body` runs again with all three trips.",
     "problem": "A list of saved trips must match what is saved: a trip added on one screen must appear on another. Fetching by hand, and fetching again after every change, is easy to forget. A query does both for the view.",
     "how": "Apple's documentation says that the modifier `modelContainer` puts the container, and a model context for it, in the view's environment, and that `Query` properties use that context. The query fetches the trips sorted by the key path after `sort:`. When the models change, its result changes, and SwiftUI runs the `body` that read it.",
     "when": [
      {
       "text": "Use it in a view that shows saved models, such as a list of trips, so that the list stays the same as what is saved."
      },
      {
       "text": "Don't use it outside a view, such as in an observable class. It needs the model context in a view's environment."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "query-property",
       "name": "The query `trips`, line 13",
       "text": "The attribute `@Query` makes `trips` a wrapped property of `Query`, a property wrapper that SwiftData provides. Its argument `sort:` orders the trips by `city`. The wrapped value is an array of the trips it fetched."
      },
      {
       "part": "model-container-modifier",
       "name": "The modifier `modelContainer`, line 29",
       "text": "The modifier puts the container in the environment of `TripList`, with a model context for it, which the query fetches with."
      }
     ],
     "marks": [
      {
       "line": 13,
       "text": "@Query(sort: \\Trip.city) var trips: [Trip]",
       "part": "query-property",
       "label": "query"
      },
      {
       "line": 29,
       "text": "modelContainer(container)",
       "part": "model-container-modifier",
       "label": "container modifier"
      }
     ],
     "steps": [
      {
       "text": "Lines 20 to 25 make a container that keeps its trips in memory, and lines 27 and 28 insert two trips into its main context.",
       "line": 27,
       "also": [
        20,
        23,
        26,
        28
       ]
      },
      {
       "text": "Line 29 puts the container in the environment of a `TripList`, and line 31 draws it. The query fetches the trips, sorted by city, and line 15 prints {{shows [\"Lima\", \"Oslo\"]}}.",
       "line": 15,
       "also": [
        29,
        30,
        31,
        13
       ],
       "prints": [
        "shows [\"Lima\", \"Oslo\"]"
       ]
      },
      {
       "text": "Line 32 inserts a third trip, Cusco. The query's result now has three trips.",
       "line": 32
      },
      {
       "text": "Line 33 runs the main run loop, and line 34 draws again. The `body` read `trips`, so it runs again, and line 15 prints {{shows [\"Cusco\", \"Lima\", \"Oslo\"]}}.",
       "line": 15,
       "also": [
        33,
        34
       ],
       "prints": [
        "shows [\"Cusco\", \"Lima\", \"Oslo\"]"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The query fetched the trips for the view, and when a trip was inserted, the view got the new result with no code of its own."
     }
    }
   }
  },
  "reference": {
   "id": "reference",
   "name": "Reference",
   "first": "The address of an instance of a class, which a constant or variable of the class holds in place of the instance.",
   "parts": []
  },
  "refresh-action": {
   "id": "refresh-action",
   "name": "Refresh action",
   "first": "The environment value that a list reads to offer pull to refresh, which runs the async closure of the refreshable modifier when it is called.",
   "parts": []
  },
  "refreshable-modifier": {
   "id": "refreshable-modifier",
   "name": "Refreshable modifier",
   "first": "The modifier that puts a refresh action, which runs its async closure, in the environment of a view and every view inside it.",
   "parts": []
  },
  "regular-size-class": {
   "id": "regular-size-class",
   "name": "Regular size class",
   "first": "The size class of a direction in which a window has a lot of room, as across an iPad.",
   "parts": []
  },
  "reload-policy": {
   "id": "reload-policy",
   "name": "Reload policy",
   "first": "The part of a timeline that says when the system asks the widget for its next timeline, such as after the last entry's date.",
   "parts": []
  },
  "representable-view": {
   "id": "representable-view",
   "name": "Representable view",
   "area": "ui",
   "first": "A SwiftUI view that makes and updates a UIKit view, so that a UIKit view can be used among SwiftUI views.",
   "parts": [
    "conformance",
    "make-ui-view",
    "update-ui-view"
   ],
   "dependsOn": [
    {
     "id": "hosting-controller",
     "views": [
      "parts"
     ],
     "why": "The example shows its view in a hosting controller, which lays it out without a window.",
     "whyInExample": "The constant `host` is a hosting controller, as `host` is on the page of Hosting controller."
    },
    {
     "id": "view",
     "views": [
      "what",
      "parts"
     ],
     "why": "A representable view is a SwiftUI view, which is placed among other views as any view is.",
     "whyInExample": "The view `CityLabel` can be placed among views, as `Greeting` can."
    },
    {
     "id": "class",
     "views": [
      "what"
     ],
     "why": "A UIKit view is an instance of a class, which SwiftUI keeps and changes by reference.",
     "whyInExample": "The call `UILabel()` makes an instance of a class, as `Counter()` does on the page of Class."
    }
   ],
   "example": {
    "ios": true,
    "code": [
     "import SwiftUI",
     "import UIKit",
     "",
     "struct CityLabel: UIViewRepresentable {",
     "    let city: String",
     "    func makeUIView(context: Context) -> UILabel {",
     "        print(\"makeUIView\")",
     "        return UILabel()",
     "    }",
     "    func updateUIView(",
     "        _ label: UILabel, context: Context",
     "    ) {",
     "        print(\"updateUIView:\", city)",
     "        label.text = city",
     "    }",
     "}",
     "",
     "let host = UIHostingController(",
     "    rootView: CityLabel(city: \"Lima\")",
     ")",
     "let room = CGSize(width: 300, height: 300)",
     "print(host.sizeThatFits(in: room).width > 0)"
    ]
   },
   "views": {
    "what": {
     "is": "A representable view is a type that conforms to `UIViewRepresentable`. It is a SwiftUI view that shows a UIKit view: its method `makeUIView` makes the UIKit view once, and its method `updateUIView` changes it to match the SwiftUI view's values, each time they change.",
     "marks": [
      {
       "line": 4,
       "text": "UIViewRepresentable",
       "part": "conformance",
       "label": "a representable view"
      },
      {
       "line": 6,
       "text": "makeUIView",
       "part": "make-ui-view",
       "label": "makes the UIKit view"
      },
      {
       "line": 10,
       "text": "updateUIView",
       "part": "update-ui-view",
       "label": "keeps it up to date"
      }
     ],
     "afterExample": "The view `CityLabel` shows a city in a UIKit label. SwiftUI makes the label once, and then sets its text from `city`. The program runs on an iPhone in the simulator, because UIKit is a framework of iOS.",
     "problem": "Some views exist only in UIKit, or in a library written for UIKit, such as a map with features that SwiftUI lacks. Writing them again in SwiftUI can be a lot of work. A representable view puts the UIKit view among SwiftUI views as it is.",
     "how": "Apple's documentation says that SwiftUI calls the methods of a representable view at the right times to make and update its view, and that the UIKit view does not tell SwiftUI about its own changes: for that, a coordinator, an object of the representable view's own, forwards its messages.",
     "when": [
      {
       "text": "Use it for a UIKit view that SwiftUI has no match for, such as a view from a library written for UIKit."
      },
      {
       "text": "Don't use it for a view that SwiftUI already has, such as a label or a button. The SwiftUI view is simpler, and updates with no code of yours."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "conformance",
       "name": "The conformance to `UIViewRepresentable`, line 4",
       "text": "The colon and the name `UIViewRepresentable` after `CityLabel` say that it conforms to the protocol, which requires the methods `makeUIView` and `updateUIView`. With them, a `CityLabel` is a SwiftUI view."
      },
      {
       "part": "make-ui-view",
       "name": "The method `makeUIView`, lines 6 to 9",
       "text": "The method makes the UIKit view, a `UILabel`, and returns it. SwiftUI calls it once, when the view first appears, and keeps the label it returns."
      },
      {
       "part": "update-ui-view",
       "name": "The method `updateUIView`, lines 10 to 15",
       "text": "The method gets the label that SwiftUI kept, and changes it to match the values of `CityLabel`: line 14 sets its text to `city`. SwiftUI calls it after `makeUIView`, and again each time the values change."
      }
     ],
     "marks": [
      {
       "line": 4,
       "text": "UIViewRepresentable",
       "part": "conformance",
       "label": "conformance"
      },
      {
       "line": 6,
       "text": "makeUIView",
       "part": "make-ui-view",
       "label": "make"
      },
      {
       "line": 10,
       "text": "updateUIView",
       "part": "update-ui-view",
       "label": "update"
      }
     ],
     "steps": [
      {
       "text": "Lines 18 to 20 make a hosting controller whose root view is a `CityLabel` for Lima.",
       "line": 18,
       "also": [
        19
       ]
      },
      {
       "text": "Line 22 asks the controller what size it needs inside 300 by 300 points. To lay out `CityLabel`, SwiftUI first calls `makeUIView`, and line 7 prints {{makeUIView}}.",
       "line": 7,
       "also": [
        22,
        6
       ],
       "prints": [
        "makeUIView"
       ]
      },
      {
       "text": "SwiftUI then calls `updateUIView` with the label, and line 13 prints {{updateUIView: Lima}}. Line 14 sets the label's text to Lima.",
       "line": 13,
       "also": [
        10,
        14
       ],
       "prints": [
        "updateUIView: Lima"
       ]
      },
      {
       "text": "The label has its text, so it has a size, and line 22 prints whether its width is more than zero: {{true}}.",
       "line": 22,
       "prints": [
        "true"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "SwiftUI made the UIKit label once, and then set it from the values of `CityLabel`, so the label showed among SwiftUI views."
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
  "root-view": {
   "id": "root-view",
   "name": "Root view",
   "first": "The first screen of a navigation stack, written in its braces, which is always at the bottom of the stack and has no back button.",
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
  "scene-storage-property": {
   "id": "scene-storage-property",
   "name": "Scene storage property",
   "first": "A property of a view marked with the SceneStorage attribute and a key, whose value the system saves for the view's scene, and restores when the scene opens again.",
   "parts": []
  },
  "scene-storage": {
   "id": "scene-storage",
   "name": "Scene storage",
   "area": "ui",
   "first": "A property wrapper that saves a small value for one scene, so that when the system opens the scene again, it opens where the user left it.",
   "parts": [
    "scene-storage-property",
    "storage-key"
   ],
   "dependsOn": [
    {
     "id": "app-storage",
     "views": [
      "what"
     ],
     "why": "Scene storage keeps a value under a key, as app storage does, but for one scene, not for the whole app.",
     "whyInExample": "The attribute `@SceneStorage(\"tab\")` keeps `tab` under the key tab, as `@AppStorage(\"nights\")` keeps `nights`."
    },
    {
     "id": "scene",
     "views": [
      "what"
     ],
     "why": "Each scene has storage of its own, which the system saves and restores with the scene.",
     "whyInExample": "In an app, `Tabs` would be inside a scene, such as the `WindowGroup` on the page of Scene."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Tabs: View {",
     "    @SceneStorage(\"tab\") private var tab = \"Trips\"",
     "    var body: some View {",
     "        let _ = print(\"tab:\", tab)",
     "        Text(tab)",
     "    }",
     "}",
     "_ = ImageRenderer(content: Tabs()).cgImage"
    ],
    "output": [
     "tab: Trips"
    ]
   },
   "views": {
    "what": {
     "is": "A property marked `@SceneStorage` keeps a small value for the scene that its view is in, under a key. Apple's documentation says that it works much as state does, except that the system saves its value, and restores it as the first value when the scene opens again. Each scene has its own storage, so two windows of the same app can each keep their own value.",
     "marks": [
      {
       "line": 4,
       "text": "@SceneStorage(\"tab\") private var tab = \"Trips\"",
       "part": "scene-storage-property",
       "label": "kept for the scene"
      },
      {
       "line": 4,
       "text": "\"tab\"",
       "part": "storage-key",
       "label": "its key"
      }
     ],
     "afterExample": "The view `Tabs` keeps which tab is shown, under the key tab. In an app, the system would restore the last tab when the scene opens again. This program has no scene, and nothing was saved, so the property has its first value, and line 6 prints {{tab: Trips}}.",
     "problem": "When the system ends an app in the background, the user expects to come back to where they were, such as the same tab and the same trip. Scene storage saves those small values for each scene, and the system restores them.",
     "how": "Apple's documentation says that the system saves and restores scene storage, makes no promise of when or how often it saves, and destroys the data when the scene is destroyed, such as when a window is closed on the Mac. It also says to keep the data small, and never to keep private data in it.",
     "when": [
      {
       "text": "Use it for where the user was in a scene, such as the chosen tab, or the trip that was open."
      },
      {
       "text": "Don't use it for the app's data, or for settings that every scene shares. A SwiftData model saves data, and app storage keeps settings for the whole app."
      }
     ]
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
  "search-field": {
   "id": "search-field",
   "name": "Search field",
   "area": "ui",
   "first": "A field for the text the user searches for, which SwiftUI places in the toolbar of a navigation stack, and whose text is a binding that the view filters its data with.",
   "parts": [
    "searchable-modifier",
    "search-text"
   ],
   "dependsOn": [
    {
     "id": "navigation-stack",
     "views": [
      "what",
      "parts"
     ],
     "why": "SwiftUI places the search field in the toolbar of the navigation stack around the view.",
     "whyInExample": "The `Text` is inside a `NavigationStack`, as `list` is on the page of Navigation stack."
    },
    {
     "id": "binding",
     "views": [
      "what",
      "parts"
     ],
     "why": "A search field writes the text the user types through a binding to a string.",
     "whyInExample": "The value `$query` is a binding to the state `query`, as `$nights` is a binding to `nights` on the page of Binding."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Cities: View {",
     "    @State private var query = \"\"",
     "    let all = [\"Lima\", \"Oslo\", \"Lisbon\"]",
     "    var body: some View {",
     "        let shown = all.filter { city in",
     "            query.isEmpty || city.contains(query)",
     "        }",
     "        let _ = print(\"shows\", shown)",
     "        NavigationStack {",
     "            Text(shown.joined(separator: \", \"))",
     "                .searchable(text: $query)",
     "                .onAppear { query = \"Li\" }",
     "        }",
     "    }",
     "}",
     "_ = ImageRenderer(content: Cities()).cgImage"
    ]
   },
   "views": {
    "what": {
     "is": "A search field is a field for the text that the user searches for. The modifier `searchable(text:)` adds one, with a binding to a string that holds the text, and SwiftUI places it in the toolbar of the navigation stack around the view. The view filters its data with that string.",
     "marks": [
      {
       "line": 13,
       "text": "searchable(text: $query)",
       "part": "searchable-modifier",
       "label": "a search field"
      },
      {
       "line": 8,
       "text": "city.contains(query)",
       "label": "filters with the text"
      }
     ],
     "afterExample": "The view `Cities` shows the cities that contain the search text. When the text becomes Li, the `body` runs again, and shows only Lima and Lisbon.",
     "problem": "A long list is hard to look through. A search field lets the user type part of a name, and the view shows only what matches. The system draws the field, in the place that users expect on each platform.",
     "how": "Apple's documentation says that the modifier, on a navigation stack or a view inside one, makes a search field appear in the toolbar, and that it takes a binding to a string, whose storage the app provides. As the user types, the field writes the text through the binding. The `body` read that state, so it runs again, and filters with the new text.",
     "when": [
      {
       "text": "Use it for a list that the user looks for items in, such as trips or cities."
      },
      {
       "text": "Don't use it for a few items that fit on the screen. A short list is quicker to read than to search."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "searchable-modifier",
       "name": "The modifier `searchable(text:)`, line 13",
       "text": "The modifier adds a search field to the toolbar of the navigation stack that the `Text` is in. It is given `$query`, a binding to the state `query`, where the field writes the text the user types."
      },
      {
       "part": "search-text",
       "name": "The search text `query`, line 4",
       "text": "The state `query` holds the search text, and starts empty. Lines 7 to 9 keep the cities that contain it, or every city while it is empty."
      }
     ],
     "marks": [
      {
       "line": 13,
       "text": "searchable(text: $query)",
       "part": "searchable-modifier",
       "label": "search field"
      },
      {
       "line": 4,
       "text": "@State private var query = \"\"",
       "part": "search-text",
       "label": "search text"
      }
     ],
     "steps": [
      {
       "text": "Line 18 makes a `Cities` and draws it. The state `query` starts empty.",
       "line": 18,
       "also": [
        4
       ]
      },
      {
       "text": "The `body` runs. The state `query` is empty, so lines 7 to 9 keep every city, and line 10 prints {{shows [\"Lima\", \"Oslo\", \"Lisbon\"]}}.",
       "line": 10,
       "also": [
        7,
        8,
        9
       ],
       "prints": [
        "shows [\"Lima\", \"Oslo\", \"Lisbon\"]"
       ]
      },
      {
       "text": "The `Text` appears, and line 14 sets `query` to `\"Li\"`, as the search field would when the user types Li.",
       "line": 14
      },
      {
       "text": "The `body` read `query`, so it runs again. Line 8 keeps the cities that contain Li, and line 10 prints {{shows [\"Lima\", \"Lisbon\"]}}.",
       "line": 10,
       "also": [
        8
       ],
       "prints": [
        "shows [\"Lima\", \"Lisbon\"]"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The search text is state, so each change to it ran the `body` again, which filtered the cities with the new text."
     }
    }
   }
  },
  "search-text": {
   "id": "search-text",
   "name": "Search text",
   "first": "The string that holds what the user typed in a search field, usually state of the view, which the view filters its data with.",
   "parts": []
  },
  "searchable-modifier": {
   "id": "searchable-modifier",
   "name": "Searchable modifier",
   "first": "The modifier that adds a search field to the toolbar of the navigation stack around a view, with a binding to the string where the field writes the text.",
   "parts": []
  },
  "shape": {
   "id": "shape",
   "name": "Shape",
   "area": "ui",
   "first": "A view that is an outline, such as a rectangle or a circle, which takes the whole size it is proposed and draws its outline to fit it.",
   "parts": [
    "conformance",
    "path-in-rect"
   ],
   "dependsOn": [
    {
     "id": "path",
     "views": [
      "what",
      "parts"
     ],
     "why": "A shape returns its outline as a path, built for the rectangle it is given.",
     "whyInExample": "The method `path(in:)` builds a path with `move(to:)`, `addLine(to:)`, and `closeSubpath()`, as on the page of Path."
    },
    {
     "id": "protocol",
     "views": [
      "what",
      "parts"
     ],
     "why": "A shape is a type that conforms to SwiftUI's shape protocol, which requires one method.",
     "whyInExample": "The type `Pennant` conforms to `Shape` by having `path(in:)`, as `Friendly` conforms to `Greeter` by having `greet(name:)`."
    },
    {
     "id": "layout-process",
     "views": [
      "what",
      "parts"
     ],
     "why": "A shape takes the whole size it is proposed in the steps of layout, and draws its outline in that size.",
     "whyInExample": "The renderer proposes 60 by 30 to `Pennant`, as `filler` proposes 300 by 200 to a color on the page of Layout process."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Pennant: Shape {",
     "    func path(in rect: CGRect) -> Path {",
     "        print(\"path(in:) gets\", rect.size)",
     "        let end = rect.maxX",
     "        let mid = rect.midY",
     "        let bottom = rect.maxY",
     "        var path = Path()",
     "        path.move(to: CGPoint(x: 0, y: 0))",
     "        path.addLine(to: CGPoint(x: end, y: mid))",
     "        path.addLine(to: CGPoint(x: 0, y: bottom))",
     "        path.closeSubpath()",
     "        return path",
     "    }",
     "}",
     "",
     "let size = CGSize(width: 60, height: 30)",
     "let renderer = ImageRenderer(content: Pennant())",
     "renderer.proposedSize = ProposedViewSize(size)",
     "let image = renderer.cgImage!",
     "print(image.width, image.height)"
    ]
   },
   "views": {
    "what": {
     "is": "A shape is a type that conforms to the protocol `Shape`. Its one required method, `path(in:)`, returns its outline for the rectangle it is given, so the same shape can be drawn at any size. A shape is a view: it takes the whole size it is proposed, and SwiftUI draws its outline in that size.",
     "marks": [
      {
       "line": 3,
       "text": "Shape",
       "part": "conformance",
       "label": "a shape"
      },
      {
       "line": 4,
       "text": "path(in rect: CGRect)",
       "part": "path-in-rect",
       "label": "its outline"
      }
     ],
     "afterExample": "The shape `Pennant` is a triangle pointing right, from the corners and the middle of the rectangle it gets. The renderer proposes 60 by 30, so SwiftUI gives `path(in:)` a rectangle of 60 by 30, and the pennant fills it.",
     "problem": "A path has fixed points, so it has one size. A view must fit whatever room it gets, on every screen. A shape describes its outline from the rectangle it gets, so it fits any size.",
     "how": "In the steps of layout, a shape chooses the whole size it is proposed. SwiftUI then calls `path(in:)` with a rectangle of that size, and draws the path it returns. Apple's documentation says that a shape with no fill or stroke of its own is filled with the foreground color.",
     "when": [
      {
       "text": "Use a shape for an outline that should fit any frame, such as a pennant, a badge, or a ticket with a notch."
      },
      {
       "text": "Don't write a shape that SwiftUI already has, such as a rectangle, a rounded rectangle, a circle, or a capsule."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "conformance",
       "name": "The conformance to `Shape`, line 3",
       "text": "The colon and the name `Shape` after `Pennant` say that `Pennant` conforms to the protocol `Shape`. Its one requirement is the method `path(in:)`, and with it, a `Pennant` is a view."
      },
      {
       "part": "path-in-rect",
       "name": "The method `path(in:)`, lines 4 to 15",
       "text": "The method gets `rect`, the rectangle that the shape is drawn in, and returns the outline for it. Lines 6 to 8 read the right edge, the middle, and the bottom of `rect`, and lines 9 to 13 build a triangle from them, so the triangle grows and shrinks with `rect`."
      }
     ],
     "marks": [
      {
       "line": 3,
       "text": "Shape",
       "part": "conformance",
       "label": "conformance"
      },
      {
       "line": 4,
       "text": "path(in rect: CGRect)",
       "part": "path-in-rect",
       "label": "outline method"
      }
     ],
     "steps": [
      {
       "text": "Line 19 makes a `Pennant` and a renderer for it, and line 20 proposes 60 by 30, the size on line 18.",
       "line": 19,
       "also": [
        18,
        20
       ]
      },
      {
       "text": "Line 21 asks for the image. In the steps of layout, the shape chooses the whole size it is proposed, 60 by 30.",
       "line": 21
      },
      {
       "text": "SwiftUI calls `path(in:)` with a rectangle of that size, and line 5 prints {{path(in:) gets (60.0, 30.0)}}.",
       "line": 5,
       "also": [
        4
       ],
       "prints": [
        "path(in:) gets (60.0, 30.0)"
       ]
      },
      {
       "text": "Lines 6 to 14 build the triangle for that rectangle, to (60, 15) and (0, 30), and return it. SwiftUI fills it.",
       "line": 14,
       "also": [
        6,
        7,
        8,
        11,
        12
       ]
      },
      {
       "text": "Line 22 prints the size of the image, the size that the shape chose: {{60 30}}.",
       "line": 22,
       "prints": [
        "60 30"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The shape took the size it was proposed, and `path(in:)` drew the pennant to fit that size."
     }
    }
   }
  },
  "sheet-binding": {
   "id": "sheet-binding",
   "name": "Presentation binding",
   "first": "The binding to a value of true or false that a sheet or an alert is given, which presents it while the value is true.",
   "parts": []
  },
  "sheet-content": {
   "id": "sheet-content",
   "name": "Sheet content",
   "first": "The view in the braces of the sheet modifier, which SwiftUI presents as the sheet.",
   "parts": []
  },
  "sheet": {
   "id": "sheet",
   "name": "Sheet",
   "area": "ui",
   "first": "A screen that SwiftUI presents over the current one while a binding is true, and takes away when it becomes false.",
   "parts": [
    "sheet-binding",
    "sheet-content"
   ],
   "dependsOn": [
    {
     "id": "binding",
     "views": [
      "what"
     ],
     "why": "A sheet is shown while a binding to a value of true or false is true.",
     "whyInExample": "The value `$editing` is a binding to the state `editing`, as `$nights` is a binding to `nights` on the page of Binding."
    },
    {
     "id": "view-modifier",
     "views": [
      "what"
     ],
     "why": "A sheet is added to a view with a modifier, which returns the view with the sheet attached.",
     "whyInExample": "The call `sheet(isPresented:)` is a modifier of the `Text`, as `padding(8)` is a modifier of `city`."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Planner: View {",
     "    @State private var editing = true",
     "    var body: some View {",
     "        Text(\"Trips\")",
     "            .sheet(isPresented: $editing) {",
     "                Text(\"Editor\")",
     "            }",
     "    }",
     "}",
     "print(type(of: Planner().body))"
    ],
    "output": [
     "ModifiedContent<Text, SheetPresentationModifier<Text, NullSheetAnchor<Key>>>"
    ]
   },
   "views": {
    "what": {
     "is": "A sheet is a screen that slides up over the current screen, which stays where it was underneath. The modifier `sheet(isPresented:)` is given a binding to a value of true or false. While the value is true, SwiftUI presents the view in the modifier's braces as a sheet.",
     "marks": [
      {
       "line": 7,
       "text": "isPresented: $editing",
       "part": "sheet-binding",
       "label": "shown while true"
      },
      {
       "line": 8,
       "text": "Text(\"Editor\")",
       "part": "sheet-content",
       "label": "the sheet"
      }
     ],
     "afterExample": "The state `editing` starts true, as if the user had tapped a button that sets it, so in an app the editor would slide up over Trips. A program with no window presents no sheet, so line 12 prints the type of the `body`: the `Text`, with a modifier that holds the sheet's content, another `Text`.",
     "problem": "A screen often needs a short task that the user finishes or cancels before going on, such as adding a trip. A sheet shows that task over the current screen, and the user comes back to the screen as it was.",
     "how": "Apple's documentation says that the binding determines whether the sheet is presented. Setting the value to true presents the sheet, and setting it to false takes the sheet away. The sheet's content is a view of its own, so it gets the data it changes through bindings passed to it.",
     "when": [
      {
       "text": "Use a sheet for a task that the user finishes and leaves, such as adding or editing one trip."
      },
      {
       "text": "Don't use a sheet for a screen that goes deeper from the current one and keeps a way back, such as the details of a trip. A navigation stack pushes that screen."
      }
     ]
    }
   }
  },
  "sidebar-column": {
   "id": "sidebar-column",
   "name": "Sidebar",
   "first": "The leading column of a split view, which usually lists the items that the user chooses from.",
   "parts": []
  },
  "size-class": {
   "id": "size-class",
   "name": "Size class",
   "area": "ui",
   "first": "Whether a window has a regular or a compact amount of room across or down, which a view reads from the environment to choose its layout.",
   "parts": [
    "compact-size-class",
    "regular-size-class"
   ],
   "dependsOn": [
    {
     "id": "environment",
     "views": [
      "what",
      "parts"
     ],
     "why": "SwiftUI sets the size classes in the environment, and a view reads them from there.",
     "whyInExample": "The property `@Environment(\\.horizontalSizeClass)` reads the size class, as `@Environment(\\.isEnabled)` reads whether views are enabled."
    },
    {
     "id": "view-builder",
     "views": [
      "parts"
     ],
     "why": "The example chooses its views with an if statement in its body, which the view builder builds.",
     "whyInExample": "The if statement on line 6 chooses a view, as the if statement in the `body` of `Card` does."
    }
   ],
   "example": {
    "ios": true,
    "code": [
     "import SwiftUI",
     "",
     "struct Trips: View {",
     "    @Environment(\\.horizontalSizeClass) var width",
     "    var body: some View {",
     "        if width == .compact {",
     "            let _ = print(\"one column\")",
     "            Text(\"Trips\")",
     "        } else {",
     "            let _ = print(\"two columns\")",
     "            Text(\"Trips and Lima\")",
     "        }",
     "    }",
     "}",
     "",
     "let phone = Trips()",
     "    .environment(\\.horizontalSizeClass, .compact)",
     "_ = ImageRenderer(content: phone).cgImage",
     "let pad = Trips()",
     "    .environment(\\.horizontalSizeClass, .regular)",
     "_ = ImageRenderer(content: pad).cgImage"
    ]
   },
   "views": {
    "what": {
     "is": "A size class says how much room a window has in one direction: compact, as across an iPhone held upright, or regular, as across an iPad. SwiftUI sets a horizontal and a vertical size class in the environment, and a view reads them with `@Environment` to choose its layout.",
     "marks": [
      {
       "line": 4,
       "text": "@Environment(\\.horizontalSizeClass) var width",
       "label": "reads the size class"
      },
      {
       "line": 17,
       "text": ".compact",
       "part": "compact-size-class",
       "label": "compact"
      },
      {
       "line": 20,
       "text": ".regular",
       "part": "regular-size-class",
       "label": "regular"
      }
     ],
     "afterExample": "The view `Trips` shows one column when the horizontal size class is compact, and two when it is regular. In an app, SwiftUI sets the size class. Here lines 17 and 20 set it, with `environment`, so that the program can show both. It runs on an iPhone in the simulator, because size classes come from iOS.",
     "problem": "One app runs on an iPhone, upright or on its side, and on an iPad, full screen or beside another app. A layout for the room on an iPad is too wide for an iPhone. A size class tells a view which kind of room it has, so the view can choose a layout for it.",
     "how": "Apple's documentation says that SwiftUI sets the size class from the device, its orientation, and how an iPad shares its screen, and that the size class can change while the app runs, such as when the device turns. A view that reads it runs its `body` again when it changes.",
     "when": [
      {
       "text": "Use it to choose between layouts for a little room and a lot of room, such as one column on an iPhone and two on an iPad."
      },
      {
       "text": "Don't use it to tell which device the app runs on. An iPad shares its screen with another app, and is then compact across, as an iPhone is."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "compact-size-class",
       "name": "The size class `.compact`, line 17",
       "text": "The value `.compact` means there is little room in that direction, as across an iPhone held upright. Line 17 sets it for `phone`, and the if statement on line 6 shows one column for it."
      },
      {
       "part": "regular-size-class",
       "name": "The size class `.regular`, line 20",
       "text": "The value `.regular` means there is a lot of room in that direction, as across an iPad. Line 20 sets it for `pad`, and the else branch on line 9 shows two columns for it."
      }
     ],
     "marks": [
      {
       "line": 17,
       "text": ".compact",
       "part": "compact-size-class",
       "label": "compact"
      },
      {
       "line": 20,
       "text": ".regular",
       "part": "regular-size-class",
       "label": "regular"
      }
     ],
     "steps": [
      {
       "text": "Lines 16 and 17 make a `Trips` whose horizontal size class is compact, as on an iPhone, and line 18 draws it.",
       "line": 18,
       "also": [
        16,
        17
       ]
      },
      {
       "text": "The `body` reads `width`, which is `.compact`, so the if statement on line 6 is true, and line 7 prints {{one column}}.",
       "line": 7,
       "also": [
        4,
        6
       ],
       "prints": [
        "one column"
       ]
      },
      {
       "text": "Lines 19 and 20 make a `Trips` whose horizontal size class is regular, as on an iPad, and line 21 draws it.",
       "line": 21,
       "also": [
        19,
        20
       ]
      },
      {
       "text": "Now `width` is `.regular`, so the else branch runs, and line 10 prints {{two columns}}.",
       "line": 10,
       "also": [
        9
       ],
       "prints": [
        "two columns"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The same view chose one column for a compact size class and two for a regular one, from the value it read in the environment."
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
  "split-view": {
   "id": "split-view",
   "name": "Split view",
   "area": "ui",
   "first": "A view that shows a list and the details of the chosen item side by side when there is room, and collapses into one stack of screens when there is not.",
   "parts": [
    "sidebar-column",
    "detail-column"
   ],
   "dependsOn": [
    {
     "id": "navigation-stack",
     "views": [
      "what",
      "parts"
     ],
     "why": "On a narrow screen, a split view collapses its columns into one navigation stack.",
     "whyInExample": "On an iPhone, the sidebar of `split` would be the root view of a stack, as `list` is on the page of Navigation stack."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "let split = NavigationSplitView {",
     "    Text(\"Trips\")",
     "        .onAppear { print(\"shows the sidebar\") }",
     "} detail: {",
     "    Text(\"Lima\")",
     "        .onAppear { print(\"shows the detail\") }",
     "}",
     "_ = ImageRenderer(content: split).cgImage"
    ]
   },
   "views": {
    "what": {
     "is": "A `NavigationSplitView` is a view that shows two or three columns side by side: a sidebar, which usually lists items, and a detail column, which shows the item the user chose. Apple's documentation says that at narrow sizes, such as on an iPhone, it collapses its columns into one stack of screens.",
     "marks": [
      {
       "line": 4,
       "text": "Text(\"Trips\")",
       "part": "sidebar-column",
       "label": "the sidebar"
      },
      {
       "line": 7,
       "text": "Text(\"Lima\")",
       "part": "detail-column",
       "label": "the detail"
      }
     ],
     "afterExample": "This program runs on a Mac, where there is room for both columns, so the split view shows the sidebar and the detail side by side.",
     "problem": "On an iPad or a Mac, a list and the details of one item fit side by side, and the user picks items without leaving the list. On an iPhone they do not fit. A split view is written once, and shows columns where there is room and a stack of screens where there is not.",
     "how": "Apple's documentation says that people choose an item in a leading column to show its details in the following columns. At narrow sizes, the split view collapses all its columns into a stack, and shows the last column that has something useful to show.",
     "when": [
      {
       "text": "Use it for the main screen of an app that lists items and shows one in detail, when the app runs on an iPad or a Mac as well as an iPhone."
      },
      {
       "text": "Don't use it for an app that only runs on an iPhone. There it is always one stack, and a navigation stack is simpler."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "sidebar-column",
       "name": "The sidebar, lines 3 to 6",
       "text": "The first braces after `NavigationSplitView` hold the sidebar, the leading column. Here it is a `Text`, Trips. In an app it is usually a list of the items the user chooses from."
      },
      {
       "part": "detail-column",
       "name": "The detail, lines 6 to 9",
       "text": "The braces after the argument label `detail:` hold the detail column, the trailing column, which shows the chosen item. Here it is a `Text`, Lima."
      }
     ],
     "marks": [
      {
       "line": 4,
       "text": "Text(\"Trips\")",
       "part": "sidebar-column",
       "label": "sidebar"
      },
      {
       "line": 6,
       "text": "detail:",
       "part": "detail-column",
       "label": "detail"
      }
     ],
     "steps": [
      {
       "text": "Line 3 makes a split view with two columns: the sidebar, in its first braces, and the detail, after `detail:`.",
       "line": 3,
       "also": [
        6
       ]
      },
      {
       "text": "Line 10 makes a renderer and draws the split view. There is room for both columns, so it shows both. The sidebar appears, and line 5 prints {{shows the sidebar}}.",
       "line": 5,
       "also": [
        10
       ],
       "prints": [
        "shows the sidebar"
       ]
      },
      {
       "text": "The detail appears beside it, and line 8 prints {{shows the detail}}.",
       "line": 8,
       "prints": [
        "shows the detail"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "With room for both, the split view showed the sidebar and the detail side by side."
     }
    }
   }
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
  "storage-key": {
   "id": "storage-key",
   "name": "Storage key",
   "first": "The string that a stored value is kept under, which every reader of the value must use.",
   "parts": []
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
  "structural-identity": {
   "id": "structural-identity",
   "name": "Structural identity",
   "first": "A view's place in its parent's body, such as the first view, or the view in the true branch of an if statement, by which SwiftUI matches a view in a new description with a view it already has.",
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
  "style-body": {
   "id": "style-body",
   "name": "Style body",
   "first": "The method of a button style that gets one button's configuration and returns the view that the button is drawn as.",
   "parts": []
  },
  "style-configuration": {
   "id": "style-configuration",
   "name": "Style configuration",
   "first": "The value that a button style gets for each button: the button's label, and whether the user is pressing it.",
   "parts": []
  },
  "suspension-point": {
   "id": "suspension-point",
   "name": "Suspension point",
   "first": "A place where code can suspend: stop running, and free its thread, until the call it waits for returns. Each await marks one.",
   "parts": []
  },
  "swiftdata-model": {
   "id": "swiftdata-model",
   "name": "SwiftData model",
   "area": "ui",
   "first": "A class whose instances SwiftData saves on the device, after a macro adds the code that saving them needs.",
   "parts": [
    "model-macro",
    "persisted-property"
   ],
   "dependsOn": [
    {
     "id": "observable",
     "views": [
      "what",
      "parts"
     ],
     "why": "A model is a class that a macro changes, as an observable class is, and a model is observable too.",
     "whyInExample": "The attribute `@Model` before `Trip` is an attached macro, as `@Observable` is before `Trip` on the page of Observable."
    }
   ],
   "example": {
    "code": [
     "import SwiftData",
     "",
     "@Model",
     "class Trip {",
     "    var city: String",
     "    var nights: Int",
     "    init(city: String, nights: Int) {",
     "        self.city = city",
     "        self.nights = nights",
     "    }",
     "}",
     "",
     "let trip = Trip(city: \"Lima\", nights: 3)",
     "print(trip.city, trip.nights)",
     "print(trip.modelContext == nil)"
    ],
    "sil": [
     {
      "in": "Trip.init(city:nights:)",
      "has": "PersistentModel.createBackingData",
      "shows": "The initializer, which the macro changed, first makes the trip's backing data, where SwiftData keeps its values."
     },
     {
      "in": "Trip.city.getter",
      "has": "PersistentModel.getValue",
      "shows": "The macro makes city a computed property, whose getter reads the value from the backing data with getValue(forKey:)."
     },
     {
      "in": "Trip.city.getter",
      "has": "ObservationRegistrar.access",
      "shows": "The getter also reports the read, as the getter of an observable class does."
     }
    ]
   },
   "views": {
    "what": {
     "is": "A SwiftData model is a class marked with the macro `@Model`. The macro adds the code that SwiftData needs to save the class's instances on the device. Apple's documentation says that the macro makes the class conform to the protocols for saved models and for observation, so a model is also an observable class.",
     "marks": [
      {
       "line": 3,
       "text": "@Model",
       "part": "model-macro",
       "label": "a model"
      },
      {
       "line": 5,
       "text": "var city: String",
       "part": "persisted-property",
       "label": "saved"
      },
      {
       "line": 6,
       "text": "var nights: Int",
       "part": "persisted-property",
       "label": "saved"
      }
     ],
     "afterExample": "The class `Trip` is a model with a city and a number of nights. Line 13 makes one, which is used as any other class's instance. It is not saved yet: line 15 shows that it is in no model context, the object that saves models.",
     "problem": "Trips that the user adds must still be there the next time the app opens, so they must be saved in a file on the device and read back. Writing that code for each class is long, and easy to get wrong. The macro writes it from the class's stored properties.",
     "how": "When swiftc builds the program, the macro gives each instance backing data, where SwiftData keeps its values, and turns each stored property into a computed property. The getter reads the value from the backing data and reports the read, and the setter writes it there and reports the change. SwiftData saves what the backing data holds.",
     "when": [
      {
       "text": "Use it for the data that an app saves, such as trips, and the items packed for each one."
      },
      {
       "text": "Don't use it for values that are not saved, such as what a screen shows while it is open. Those belong in state, or in an observable class."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "model-macro",
       "name": "The macro `@Model`, line 3",
       "text": "An attached macro written before the class. When swiftc builds the program, it adds backing data to `Trip`, where SwiftData keeps the trip's values, and makes `Trip` a saved model and an observable class."
      },
      {
       "part": "persisted-property",
       "name": "The saved properties, lines 5 and 6",
       "text": "The properties `city` and `nights` are written as plain stored properties. The macro makes each one a computed property, whose getter reads its value from the backing data, and whose setter writes the value there. Each one is saved with the trip."
      }
     ],
     "marks": [
      {
       "line": 3,
       "text": "@Model",
       "part": "model-macro",
       "label": "macro"
      },
      {
       "line": 5,
       "text": "var city: String",
       "part": "persisted-property",
       "label": "saved property"
      },
      {
       "line": 6,
       "text": "var nights: Int",
       "part": "persisted-property",
       "label": "saved property"
      }
     ],
     "steps": [
      {
       "text": "Line 13 calls the initializer on line 7. The macro changed it, so it first makes the trip's backing data, and lines 8 and 9 put the city and the number of nights in it.",
       "line": 13,
       "also": [
        7,
        8,
        9
       ]
      },
      {
       "text": "Line 14 reads both properties, through the getters that the macro made, and prints {{Lima 3}}.",
       "line": 14,
       "prints": [
        "Lima 3"
       ]
      },
      {
       "text": "Line 15 reads `modelContext`, the model context that the trip is in. The trip has not been put in one, so it is nil, and line 15 prints {{true}}.",
       "line": 15,
       "prints": [
        "true"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The macro made `city` and `nights` read and write the values that SwiftData keeps. The trip is saved only once it is put in a model context."
     }
    }
   }
  },
  "tab-selection": {
   "id": "tab-selection",
   "name": "Tab selection",
   "first": "The binding that a tab view is given to the value of the chosen tab, which it reads to choose the tab it shows, and writes when the user taps a tab.",
   "parts": []
  },
  "tab-view": {
   "id": "tab-view",
   "name": "Tab view",
   "area": "ui",
   "first": "A view that shows one of several screens at a time, with a tab bar that the user chooses a screen from.",
   "parts": [
    "tab",
    "tab-selection"
   ],
   "dependsOn": [
    {
     "id": "view",
     "views": [
      "what",
      "parts"
     ],
     "why": "A tab view is a view, and each of its tabs shows a view.",
     "whyInExample": "Each tab shows a `Screen`, a view, as `Greeting` is a view."
    },
    {
     "id": "binding",
     "views": [
      "what",
      "parts"
     ],
     "why": "A tab view is given a binding to the value of the chosen tab, so that code can read and change which tab is shown.",
     "whyInExample": "The value `$chosen` is a binding to the state `chosen`, as `$nights` is a binding to `nights` on the page of Binding."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Screen: View {",
     "    let name: String",
     "    var body: some View {",
     "        let _ = print(name, \"shows\")",
     "        Text(name)",
     "    }",
     "}",
     "",
     "struct Tabs: View {",
     "    @State private var chosen = 2",
     "    var body: some View {",
     "        TabView(selection: $chosen) {",
     "            Tab(\"Trips\", systemImage: \"bag\",",
     "                value: 1) {",
     "                Screen(name: \"Trips\")",
     "            }",
     "            Tab(\"Map\", systemImage: \"map\",",
     "                value: 2) {",
     "                Screen(name: \"Map\")",
     "            }",
     "        }",
     "        .onAppear { chosen = 1 }",
     "    }",
     "}",
     "",
     "let renderer = ImageRenderer(content: Tabs())",
     "_ = renderer.cgImage",
     "RunLoop.main.run(until: .now + 0.1)",
     "_ = renderer.cgImage"
    ]
   },
   "views": {
    "what": {
     "is": "A `TabView` is a view that shows one of several screens at a time. Each `Tab` in its braces is one screen, with a title and a symbol in the tab bar, where the user chooses a screen. A binding to a value says which tab is chosen, so code can choose a tab too.",
     "marks": [
      {
       "line": 15,
       "text": "Tab",
       "part": "tab",
       "label": "a tab"
      },
      {
       "line": 14,
       "text": "selection: $chosen",
       "part": "tab-selection",
       "label": "the chosen tab"
      }
     ],
     "afterExample": "The state `chosen` starts at 2, so the Map tab is shown first. When the tab view appears, line 24 sets `chosen` to 1, and the tab view shows the Trips tab.",
     "problem": "An app often has a few separate areas, such as trips, a map, and settings, that the user moves between at any time. A tab view keeps them side by side, so the user moves to any of them with one tap, and shows the screen of only one at a time.",
     "how": "Apple's documentation says that each tab should have a unique value, of the same type for all the tabs, and that when people select a tab, the tab view updates the selection binding to that tab's value. It also works the other way: changing the value shows the tab with that value.",
     "when": [
      {
       "text": "Use it for the few main areas of an app, which the user moves between at any time."
      },
      {
       "text": "Don't use it for steps that follow one another, such as the screens of a sign-up. A navigation stack shows screens one on top of another, with a way back."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "tab",
       "name": "The tabs, lines 15 to 22",
       "text": "Each `Tab` has a title, a symbol from Apple's symbols, a value, and the screen it shows, in its braces. The first tab's value is 1, and the second tab's value is 2."
      },
      {
       "part": "tab-selection",
       "name": "The selection, line 14",
       "text": "The argument `selection` gives the tab view a binding to `chosen`. The tab view shows the tab whose value is `chosen`, and when the user taps a tab, it writes that tab's value to `chosen`."
      }
     ],
     "marks": [
      {
       "line": 15,
       "text": "Tab",
       "part": "tab",
       "label": "tab 1"
      },
      {
       "line": 19,
       "text": "Tab",
       "part": "tab",
       "label": "tab 2"
      },
      {
       "line": 14,
       "text": "selection: $chosen",
       "part": "tab-selection",
       "label": "selection"
      }
     ],
     "steps": [
      {
       "text": "Line 28 makes a `Tabs` and a renderer, and line 29 asks for the image. The state `chosen` starts at 2.",
       "line": 29,
       "also": [
        28,
        12
       ]
      },
      {
       "text": "The tab view shows the tab whose value is 2. It makes that tab's screen, and line 6 prints {{Map shows}}. It does not make the screen of the other tab.",
       "line": 6,
       "also": [
        20,
        21
       ],
       "prints": [
        "Map shows"
       ]
      },
      {
       "text": "The tab view appears, and line 24 sets `chosen` to 1.",
       "line": 24
      },
      {
       "text": "Line 30 runs the main run loop, the loop that does the work waiting on the main thread, and line 31 asks for the image again. The tab view now shows the tab whose value is 1, and line 6 prints {{Trips shows}}.",
       "line": 6,
       "also": [
        30,
        31,
        16
       ],
       "prints": [
        "Trips shows"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The tab view showed the tab whose value was in `chosen`, and changing `chosen` showed the other tab."
     }
    }
   }
  },
  "tab": {
   "id": "tab",
   "name": "Tab",
   "first": "One screen of a tab view, with a title and a symbol for the tab bar, and a value that says which tab it is.",
   "parts": []
  },
  "task-action": {
   "id": "task-action",
   "name": "Task modifier closure",
   "first": "The async closure of the task modifier, which SwiftUI runs in a new task before the view appears, and cancels if the view is removed first.",
   "parts": []
  },
  "task-closure": {
   "id": "task-closure",
   "name": "Task closure",
   "first": "The async closure that a task runs, whose return value becomes the task's result.",
   "parts": []
  },
  "task-modifier": {
   "id": "task-modifier",
   "name": "Task modifier",
   "area": "ui",
   "first": "A modifier that starts a task before its view appears, and cancels the task if the view is removed before the task ends.",
   "parts": [
    "task-action"
   ],
   "dependsOn": [
    {
     "id": "task",
     "views": [
      "what",
      "parts"
     ],
     "why": "The modifier runs its closure in a task, which can wait for async work while the view is on the screen.",
     "whyInExample": "The closure on line 13 runs in a task, as the closure after `Task` does on the page of Task."
    },
    {
     "id": "view-update",
     "views": [
      "parts"
     ],
     "why": "The task changes state when its work ends, which runs the body again with the new value.",
     "whyInExample": "The property `report` is state that the `body` read, as `taps` is on the page of View update."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "func fetch() async -> String {",
     "    try? await Task.sleep(for: .milliseconds(50))",
     "    return \"sunny\"",
     "}",
     "",
     "struct Weather: View {",
     "    @State private var report = \"loading\"",
     "    var body: some View {",
     "        let _ = print(\"shows\", report)",
     "        Text(report)",
     "            .task { report = await fetch() }",
     "    }",
     "}",
     "",
     "let renderer = ImageRenderer(content: Weather())",
     "_ = renderer.cgImage",
     "RunLoop.main.run(until: .now + 0.3)",
     "_ = renderer.cgImage"
    ]
   },
   "snippets": {
    "cancel": {
     "code": [
      "import SwiftUI",
      "",
      "func fetch() async -> String {",
      "    try? await Task.sleep(for: .seconds(1))",
      "    print(\"cancelled:\", Task.isCancelled)",
      "    return \"sunny\"",
      "}",
      "",
      "struct Weather: View {",
      "    @State private var report = \"loading\"",
      "    var body: some View {",
      "        Text(report)",
      "            .task { report = await fetch() }",
      "    }",
      "}",
      "",
      "let first = AnyView(Weather())",
      "let renderer = ImageRenderer(content: first)",
      "_ = renderer.cgImage",
      "RunLoop.main.run(until: .now + 0.1)",
      "renderer.content = AnyView(Text(\"Map\"))",
      "_ = renderer.cgImage",
      "RunLoop.main.run(until: .now + 0.3)"
     ],
     "output": [
      "cancelled: true"
     ]
    }
   },
   "views": {
    "what": {
     "is": "The modifier `task` starts a task before its view appears, and runs its async closure in that task. Apple's documentation says that the task's lifetime matches the view's: if the task has not finished when SwiftUI removes the view, or the view changes identity, SwiftUI cancels it.",
     "marks": [
      {
       "line": 13,
       "text": ".task { report = await fetch() }",
       "part": "task-action",
       "label": "runs while the view is there"
      }
     ],
     "afterExample": "The view `Weather` shows loading, and its task fetches the report. When `fetch()` returns, the task sets `report`, and the view shows sunny.",
     "problem": "A screen often loads its data when it appears, such as the weather for a trip, and loading is async. A task started by hand would also need code to cancel it when the user leaves the screen. The task modifier starts the task and cancels it.",
     "how": "The closure is async, so it can wait with `await`. When the data arrives, it changes state, which runs the `body` again with the data. If the view is removed first, SwiftUI cancels the task, and the async code it waits in can stop early.",
     "when": [
      {
       "text": "Use it to load a view's data when the view appears, such as a forecast, or the trips of a list."
      },
      {
       "text": "Don't make a task by hand when the view appears, for this. That task is not cancelled when the view goes away, and goes on loading for a screen that is gone. With the modifier, when the view is replaced while its task waits, SwiftUI cancels the task:",
       "snippet": "cancel"
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "task-action",
       "name": "The task's closure, line 13",
       "text": "The closure after `task` is async. It waits for `fetch()` with `await`, then sets `report` to the result. SwiftUI runs it in a new task before the `Text` appears."
      }
     ],
     "marks": [
      {
       "line": 13,
       "text": "{ report = await fetch() }",
       "part": "task-action",
       "label": "task's closure"
      }
     ],
     "steps": [
      {
       "text": "Line 17 makes a `Weather` and a renderer, and line 18 draws it. The state `report` starts as loading.",
       "line": 18,
       "also": [
        17,
        9
       ]
      },
      {
       "text": "The `body` runs, and line 11 prints {{shows loading}}.",
       "line": 11,
       "prints": [
        "shows loading"
       ]
      },
      {
       "text": "Before the `Text` appears, SwiftUI starts a task that runs the closure on line 13. It calls `fetch()`, which suspends for 50 milliseconds on line 4.",
       "line": 13,
       "also": [
        4
       ]
      },
      {
       "text": "Line 19 runs the main run loop, the loop that does the work waiting on the main thread, for 0.3 seconds. In that time `fetch()` returns `\"sunny\"`, and line 13 sets `report` to it.",
       "line": 13,
       "also": [
        19,
        5
       ]
      },
      {
       "text": "Line 20 draws again. The `body` read `report`, so it runs again, and line 11 prints {{shows sunny}}.",
       "line": 11,
       "also": [
        20
       ],
       "prints": [
        "shows sunny"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The task that the modifier started loaded the report while the view was on the screen, and the change to `report` showed it."
     }
    }
   }
  },
  "task-value": {
   "id": "task-value",
   "name": "Task result",
   "first": "The value that a task's closure returned, which code reads with await, waiting until the task has finished.",
   "parts": []
  },
  "task": {
   "id": "task",
   "name": "Task",
   "area": "conc",
   "first": "A unit of work that runs an async closure, at the same time as the code that made it, which that code can wait for or cancel.",
   "parts": [
    "task-closure",
    "task-value"
   ],
   "dependsOn": [
    {
     "id": "async-function",
     "views": [
      "what",
      "parts"
     ],
     "why": "A task runs async code, which can suspend while it waits, from code that may not be able to wait.",
     "whyInExample": "The function `pack()` is async, as `makeTea(cups:)` is, and the task calls it with `await`."
    }
   ],
   "example": {
    "code": [
     "func pack() async -> String {",
     "    print(\"packing\")",
     "    try? await Task.sleep(for: .milliseconds(100))",
     "    return \"packed\"",
     "}",
     "",
     "let work = Task {",
     "    await pack()",
     "}",
     "print(\"task started\")",
     "print(await work.value)"
    ],
    "sil": [
     {
      "in": "closure #1 in ",
      "has": "hop_to_executor",
      "shows": "The closure of the task on line 7 first moves to the executor of the main actor, which runs code on the main thread, as the top-level code does."
     },
     {
      "in": "closure #1 in ",
      "has": "MainActor.shared",
      "shows": "The executor that the closure moves to is the one of MainActor.shared, the main actor."
     }
    ]
   },
   "views": {
    "what": {
     "is": "A task is a unit of work that runs an async closure, at the same time as other code. Writing `Task` before a closure makes one, as line 7 does, and the task starts by itself: no code calls it to start. The task's `value` is what its closure returns, which other code waits for with `await`.",
     "marks": [
      {
       "line": 7,
       "text": "Task {",
       "part": "task-closure",
       "label": "starts the work"
      },
      {
       "line": 11,
       "text": "await work.value",
       "part": "task-value",
       "label": "waits for its result"
      }
     ],
     "afterExample": "Line 7 makes a task that packs, and line 10 runs before the packing starts. Line 11 then waits for the task's result.",
     "problem": "Synchronous code, such as the action of a button, cannot call an async function, because it cannot wait. A task can: it is made from any code, runs the async work, and lets the code that made it go on without waiting.",
     "how": "Apple's documentation says that a task can start running right after it is made, and that it runs whether or not code keeps a reference to it. Keeping it, as `work`, lets code wait for its result, or cancel it. Here the top-level code and the task's closure both run on the main thread, so the closure starts when the top-level code waits.",
     "when": [
      {
       "text": "Use a task to start async work from code that is not async, such as the action of a button."
      },
      {
       "text": "Don't make a task inside an async function only to wait for it at once. Call the async function with `await` instead."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "task-closure",
       "name": "The task, lines 7 to 9",
       "text": "The closure after `Task` is the work that the task runs. It is async, so it can call `pack()` with `await`. What it returns, `\"packed\"`, becomes the task's result."
      },
      {
       "part": "task-value",
       "name": "The result, line 11",
       "text": "The property `value` of `work` is the task's result. Reading it with `await` waits until the task has finished, then gives what the closure returned."
      }
     ],
     "marks": [
      {
       "line": 7,
       "text": "Task {",
       "part": "task-closure",
       "label": "task"
      },
      {
       "line": 11,
       "text": "await work.value",
       "part": "task-value",
       "label": "result"
      }
     ],
     "steps": [
      {
       "text": "Line 7 makes a task, which will run the closure on lines 7 to 9. The closure runs on the main thread, as the top-level code does, so it waits to start.",
       "line": 7,
       "also": [
        8
       ]
      },
      {
       "text": "The top-level code goes on, and line 10 prints {{task started}}.",
       "line": 10,
       "prints": [
        "task started"
       ]
      },
      {
       "text": "Line 11 waits for the task's result, so the top-level code suspends, and the task's closure starts. It calls `pack()`, and line 2 prints {{packing}}.",
       "line": 2,
       "also": [
        11,
        8
       ],
       "prints": [
        "packing"
       ]
      },
      {
       "text": "Line 3 suspends `pack()` for a tenth of a second, and line 4 returns `\"packed\"`, which is the task's result.",
       "line": 4,
       "also": [
        3
       ]
      },
      {
       "text": "The task has finished, so line 11 goes on, and prints the result: {{packed}}.",
       "line": 11,
       "prints": [
        "packed"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The task ran its async work while the top-level code went on, and the top-level code got the result by waiting for `work.value`."
     }
    }
   }
  },
  "text-field-prompt": {
   "id": "text-field-prompt",
   "name": "Prompt",
   "first": "The text that a text field shows, dimmed, while its string is empty, to say what to type.",
   "parts": []
  },
  "text-field": {
   "id": "text-field",
   "name": "Text field",
   "area": "ui",
   "first": "A control that lets the user type and edit a string, which it reads and writes through a binding.",
   "parts": [
    "text-field-prompt",
    "control-binding"
   ],
   "dependsOn": [
    {
     "id": "control",
     "views": [
      "what",
      "parts"
     ],
     "why": "A text field is a control that changes a value through a binding.",
     "whyInExample": "The argument `text: $name` gives the field a binding, as `isOn: $reminders` gives the toggle one on the page of Control."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct NameField: View {",
     "    @State private var name = \"\"",
     "    var body: some View {",
     "        let _ = print(\"name is \\\"\\(name)\\\"\")",
     "        TextField(\"Trip name\", text: $name)",
     "            .onAppear { name = \"Lima\" }",
     "    }",
     "}",
     "_ = ImageRenderer(content: NameField()).cgImage"
    ]
   },
   "views": {
    "what": {
     "is": "A `TextField` is a control that lets the user type and edit a string, with the keyboard. It is given a prompt, which it shows while it is empty, and a binding to the string. Apple's documentation says that for a string, the field updates the value continuously as the user types.",
     "marks": [
      {
       "line": 7,
       "text": "\"Trip name\"",
       "part": "text-field-prompt",
       "label": "shown while empty"
      },
      {
       "line": 7,
       "text": "text: $name",
       "part": "control-binding",
       "label": "the string it edits"
      }
     ],
     "afterExample": "The field edits `name`. No one types here, so line 8 sets `name` to Lima, as the field would after the user typed it, and the `body` runs again with the new string.",
     "problem": "Many screens need words from the user, such as the name of a trip or a city to search for. A text field shows the keyboard, lets the user type and edit, and gives the code each change.",
     "how": "The field reads the string through its binding to show it, and writes the new string through the binding after each change. The string is usually state, so the `body` that read it runs again. A modifier can run code when the user presses Return, to submit the text.",
     "when": [
      {
       "text": "Use it for a short string on one line, such as a name or a city."
      },
      {
       "text": "Don't use it for long text of many lines, such as notes about a trip. A text editor shows and edits many lines."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "text-field-prompt",
       "name": "The prompt, line 7",
       "text": "The first argument, Trip name, is the prompt. The field shows it, dimmed, while the string is empty, to say what to type."
      },
      {
       "part": "control-binding",
       "name": "The binding, line 7",
       "text": "The argument `text` gives the field a binding to `name`. The field shows the string that `name` holds, and writes the string through the binding as the user types."
      }
     ],
     "marks": [
      {
       "line": 7,
       "text": "\"Trip name\"",
       "part": "text-field-prompt",
       "label": "prompt"
      },
      {
       "line": 7,
       "text": "text: $name",
       "part": "control-binding",
       "label": "binding"
      }
     ],
     "steps": [
      {
       "text": "Line 11 makes a `NameField` and draws it. The state `name` starts empty.",
       "line": 11,
       "also": [
        4
       ]
      },
      {
       "text": "The `body` runs, and line 6 prints {{name is \"\"}}. The string is empty, so the field shows its prompt.",
       "line": 6,
       "also": [
        7
       ],
       "prints": [
        "name is \"\""
       ]
      },
      {
       "text": "The field appears, and line 8 sets `name` to `\"Lima\"`, as the field does through its binding as the user types.",
       "line": 8
      },
      {
       "text": "The `body` read `name`, so it runs again, and line 6 prints {{name is \"Lima\"}}. The field now shows Lima.",
       "line": 6,
       "prints": [
        "name is \"Lima\""
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The field read and wrote `name` through its binding, so each change to the string ran the `body` again."
     }
    }
   }
  },
  "text-style": {
   "id": "text-style",
   "name": "Text style",
   "first": "A named role for text, such as body, headline, or caption, which has a font size for each text size the user can choose.",
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
  "timeline-entry": {
   "id": "timeline-entry",
   "name": "Timeline entry",
   "first": "One item of a widget's timeline: the date when the widget's view should be shown, and the data that the view needs at that date.",
   "parts": []
  },
  "timeline": {
   "id": "timeline",
   "name": "Timeline",
   "first": "The list of entries that a widget gives the system ahead of time, in the order of their dates, with a policy for when to ask for the next list.",
   "parts": []
  },
  "toolbar-item": {
   "id": "toolbar-item",
   "name": "Toolbar item",
   "first": "One view in a toolbar, such as a button, with the placement that says where in the bars it goes.",
   "parts": []
  },
  "toolbar-placement": {
   "id": "toolbar-placement",
   "name": "Toolbar placement",
   "first": "The value that says where a toolbar item goes, such as the place of a screen's main action, which each platform puts where its users expect it.",
   "parts": []
  },
  "toolbar": {
   "id": "toolbar",
   "name": "Toolbar",
   "area": "ui",
   "first": "The buttons and menus in a screen's navigation bar or bottom bar, which a view inside the screen lists with a modifier.",
   "parts": [
    "toolbar-item",
    "toolbar-placement"
   ],
   "dependsOn": [
    {
     "id": "view-modifier",
     "views": [
      "what"
     ],
     "why": "A view lists its screen's toolbar items with a modifier.",
     "whyInExample": "The call `toolbar` is a modifier of the `Text`, as `padding(8)` is a modifier of `city`."
    },
    {
     "id": "navigation-stack",
     "views": [
      "what"
     ],
     "why": "On iOS, toolbar items usually go in the navigation bar of a navigation stack.",
     "whyInExample": "In an app, the `Text` would be inside a navigation stack, as `list` is on the page of Navigation stack, and its Add button would go in that stack's navigation bar."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "let trips = Text(\"Trips\")",
     "    .toolbar {",
     "        ToolbarItem(placement: .primaryAction) {",
     "            Button(\"Add\") {}",
     "        }",
     "    }",
     "print(type(of: trips))"
    ],
    "output": [
     "ModifiedContent<Text, ToolbarModifier<(), TupleToolbarContent<ToolbarItem<(), Button<Text>>>>>"
    ]
   },
   "views": {
    "what": {
     "is": "A toolbar is the row of buttons and menus in a screen's navigation bar, or in a bar at the bottom of the screen. A view lists the items of its screen's toolbar with the modifier `toolbar`, and each `ToolbarItem` says where its item goes, with a placement.",
     "marks": [
      {
       "line": 5,
       "text": "ToolbarItem",
       "part": "toolbar-item",
       "label": "an item"
      },
      {
       "line": 5,
       "text": ".primaryAction",
       "part": "toolbar-placement",
       "label": "where it goes"
      }
     ],
     "afterExample": "In an app inside a navigation stack, the Add button would go where a screen's main action goes. A program with no window shows no toolbar, so line 9 prints the type: the `Text`, with a modifier that holds a toolbar item with the button.",
     "problem": "Actions of a whole screen, such as adding a trip, need a place that is the same on every screen, where users look for them. A toolbar puts them in the bars that the system draws, in the places each platform uses.",
     "how": "Apple's documentation says that the modifier fills the toolbar or the navigation bar with the views it is given, each in a `ToolbarItem` or in a group of items. It also says that on iOS the placement `.primaryAction` is the trailing edge of the navigation bar, and on the Mac the leading edge of the toolbar.",
     "when": [
      {
       "text": "Use it for actions of the whole screen, such as Add, Edit, or Share."
      },
      {
       "text": "Don't put the actions of one item there, such as deleting one trip. They belong with that item, such as in its row."
      }
     ]
    }
   }
  },
  "tracked-property": {
   "id": "tracked-property",
   "name": "Tracked property",
   "first": "A stored property of an observable class, which the macro turns into a computed property that reports each read and each change, and whose value it keeps in a stored property of its own.",
   "parts": []
  },
  "transfer-representation": {
   "id": "transfer-representation",
   "name": "Transfer representation",
   "first": "One way that a transferable type becomes data and back, for one content type, listed in the type's required property.",
   "parts": []
  },
  "transferable": {
   "id": "transferable",
   "name": "Transferable",
   "area": "ui",
   "first": "A protocol for a type whose values can be dragged, dropped, copied, or shared, because the type says how its values become data and how data becomes values again.",
   "parts": [
    "conformance",
    "transfer-representation",
    "content-type"
   ],
   "dependsOn": [
    {
     "id": "protocol",
     "views": [
      "what",
      "parts"
     ],
     "why": "Transferable is a protocol, whose one requirement lists how the type becomes data.",
     "whyInExample": "The type `Trip` conforms to `Transferable` by having `transferRepresentation`, as `Friendly` conforms to `Greeter` by having `greet(name:)`."
    },
    {
     "id": "async-function",
     "views": [
      "parts"
     ],
     "why": "Turning a value into data and back are async functions, so their calls are written with await.",
     "whyInExample": "The call `try await trip.exported(as: .json)` waits for an async function, as `await makeTea(cups: 2)` does."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Trip: Codable, Transferable {",
     "    let city: String",
     "    let nights: Int",
     "    static var transferRepresentation:",
     "        some TransferRepresentation {",
     "        CodableRepresentation(contentType: .json)",
     "    }",
     "}",
     "",
     "let trip = Trip(city: \"Lima\", nights: 3)",
     "let data = try await trip.exported(as: .json)",
     "print(data.count, \"bytes of JSON\")",
     "let copy = try await Trip(",
     "    importing: data, contentType: .json",
     ")",
     "print(copy.city, copy.nights)"
    ]
   },
   "views": {
    "what": {
     "is": "A type that conforms to the protocol `Transferable` says how its values become data, and how data becomes values again, for each kind of data it supports, such as JSON or plain text. Apple's documentation says that the protocol describes how a type works with ways of moving data, such as drag and drop and copy and paste.",
     "marks": [
      {
       "line": 3,
       "text": "Transferable",
       "part": "conformance",
       "label": "transferable"
      },
      {
       "line": 8,
       "text": "CodableRepresentation(contentType: .json)",
       "part": "transfer-representation",
       "label": "becomes JSON"
      }
     ],
     "afterExample": "A `Trip` becomes JSON and back. Line 13 turns `trip` into 26 bytes of JSON, as a drag of the trip would, and lines 15 to 17 make a new trip from those bytes, as the place it was dropped would.",
     "problem": "To move a trip onto another view, or into another app, it must become data that the other side can read, labeled with what kind of data it is. A transferable type says that once, and drag and drop, copy and paste, and sharing all use it.",
     "how": "The property `transferRepresentation` lists the type's representations. A `CodableRepresentation` uses the type's conformance to `Codable`, for which swiftc writes the code that turns a value into data and back. Apple's documentation says that when the other side recognizes several representations, the first one in the list is used.",
     "when": [
      {
       "text": "Use it for a type of your own that the user can drag, copy, or share, such as a trip."
      },
      {
       "text": "Don't write it for strings, images, or web addresses. They are already transferable."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "conformance",
       "name": "The conformances, line 3",
       "text": "The type `Trip` conforms to two protocols. For `Codable`, swiftc writes the code that turns a `Trip` into data, such as JSON, and back. The protocol `Transferable` requires one property, `transferRepresentation`."
      },
      {
       "part": "transfer-representation",
       "name": "The property `transferRepresentation`, lines 6 to 9",
       "text": "This static property lists how a `Trip` becomes data and back. Its type is an opaque type, `some TransferRepresentation`. It has one representation, a `CodableRepresentation`, which uses the code that swiftc wrote for `Codable`."
      },
      {
       "part": "content-type",
       "name": "The content type `.json`, line 8",
       "text": "A content type says what kind of data the bytes are, such as JSON, plain text, or a picture. The other side reads it to know whether it can use the data."
      }
     ],
     "marks": [
      {
       "line": 3,
       "text": "Codable, Transferable",
       "part": "conformance",
       "label": "conformances"
      },
      {
       "line": 6,
       "text": "transferRepresentation",
       "part": "transfer-representation",
       "label": "representation"
      },
      {
       "line": 8,
       "text": ".json",
       "part": "content-type",
       "label": "content type"
      }
     ],
     "steps": [
      {
       "text": "Line 12 makes a trip to Lima for 3 nights.",
       "line": 12
      },
      {
       "text": "Line 13 asks the trip for its data as JSON. The representation on line 8 has that content type, so it turns the trip into JSON.",
       "line": 13,
       "also": [
        8
       ]
      },
      {
       "text": "Line 14 prints how many bytes the data has: {{26 bytes of JSON}}.",
       "line": 14,
       "prints": [
        "26 bytes of JSON"
       ]
      },
      {
       "text": "Lines 15 to 17 make a new `Trip` from the data, which the same representation reads back from JSON.",
       "line": 15,
       "also": [
        16,
        17
       ]
      },
      {
       "text": "Line 18 prints the values of the copy: {{Lima 3}}.",
       "line": 18,
       "prints": [
        "Lima 3"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The trip became JSON, and the JSON became a trip with the same values, through the representation that `Trip` listed."
     }
    }
   }
  },
  "transition-effect": {
   "id": "transition-effect",
   "name": "Kind of transition",
   "first": "The change that a transition makes to a view as it comes in and goes out, such as fading it, sliding it from an edge, or growing it from nothing.",
   "parts": []
  },
  "transition-modifier": {
   "id": "transition-modifier",
   "name": "Transition modifier",
   "first": "The modifier that gives a view the transition that SwiftUI uses when the view is inserted or removed.",
   "parts": []
  },
  "transition": {
   "id": "transition",
   "name": "Transition",
   "area": "ui",
   "first": "How a view is animated as it is inserted into the screen or removed from it, such as fading in and fading out.",
   "parts": [
    "transition-modifier",
    "transition-effect"
   ],
   "dependsOn": [
    {
     "id": "animation",
     "views": [
      "what",
      "parts"
     ],
     "why": "A transition runs when a view is inserted or removed in an animated change.",
     "whyInExample": "Line 19 makes its change inside `withAnimation`, as line 14 does on the page of Animation."
    },
    {
     "id": "view-identity",
     "views": [
      "what",
      "parts"
     ],
     "why": "A view is inserted when a view with a new identity appears, and removed when its identity goes away.",
     "whyInExample": "The `Text` in the if statement has its place as its identity, as `Counter()` has on the page of View identity."
    },
    {
     "id": "view-builder",
     "views": [
      "parts"
     ],
     "why": "The example inserts and removes its view with an if statement, which the view builder builds.",
     "whyInExample": "The if statement on line 6 is there only when `shown` is true, as the one in the `body` of `Card` on the page of View builder."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Card: View {",
     "    let shown: Bool",
     "    var body: some View {",
     "        if shown {",
     "            Text(\"Lima\")",
     "                .transition(.opacity)",
     "                .onAppear { print(\"inserted\") }",
     "                .onDisappear { print(\"removed\") }",
     "        }",
     "    }",
     "}",
     "",
     "let card = Card(shown: true)",
     "let renderer = ImageRenderer(content: card)",
     "_ = renderer.cgImage",
     "withAnimation {",
     "    renderer.content = Card(shown: false)",
     "}",
     "_ = renderer.cgImage"
    ]
   },
   "views": {
    "what": {
     "is": "A transition says how a view is animated as it is inserted into the screen or removed from it. The modifier `transition` gives a view its transition, such as `.opacity`, which fades it in and out. Apple's documentation says that when the view appears or disappears, its transition is applied, so that it can be animated in and out.",
     "marks": [
      {
       "line": 8,
       "text": "transition(.opacity)",
       "part": "transition-modifier",
       "label": "how it comes and goes"
      },
      {
       "line": 8,
       "text": ".opacity",
       "part": "transition-effect",
       "label": "fades"
      }
     ],
     "afterExample": "The view `Card` shows its `Text` only while `shown` is true. Line 19 gives the renderer a card whose `shown` is false, inside `withAnimation`, so the `Text` is removed, and in an app it would fade out.",
     "problem": "A view that appears or disappears at once changes the screen in one frame, and the user can miss what changed. A transition animates the view in and out, so the user sees it arrive and leave.",
     "how": "A view is inserted when a view with a new identity appears, such as when the condition of an if statement becomes true, and removed when its identity goes away. When that happens in an animated change, SwiftUI animates the view with its transition, which for `.opacity` goes from clear to opaque as the view comes in, and back as it goes out.",
     "when": [
      {
       "text": "Use it for a view that comes and goes, such as a banner, a detail that opens, or a row that is added."
      },
      {
       "text": "Don't expect a transition on a view that only changes, such as a `Text` whose words change. It stays the same view, so it is never inserted or removed, and its transition does not run."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "transition-modifier",
       "name": "The modifier `transition`, line 8",
       "text": "The modifier `transition` gives the `Text` the transition that SwiftUI uses when the `Text` is inserted or removed. It changes nothing while the view stays on the screen."
      },
      {
       "part": "transition-effect",
       "name": "The transition `.opacity`, line 8",
       "text": "The transition `.opacity` fades the view in when it is inserted, and out when it is removed. Other transitions slide a view in from an edge, or grow it from nothing."
      }
     ],
     "marks": [
      {
       "line": 8,
       "text": "transition(.opacity)",
       "part": "transition-modifier",
       "label": "transition"
      },
      {
       "line": 8,
       "text": ".opacity",
       "part": "transition-effect",
       "label": "fade"
      }
     ],
     "steps": [
      {
       "text": "Lines 15 to 17 draw a `Card` whose `shown` is true. The if statement on line 6 is true, so SwiftUI inserts the `Text`, and line 9 prints {{inserted}}.",
       "line": 9,
       "also": [
        15,
        16,
        17,
        6
       ],
       "prints": [
        "inserted"
       ]
      },
      {
       "text": "Line 19 gives the renderer a `Card` whose `shown` is false, inside `withAnimation` on line 18, so the change is animated.",
       "line": 19,
       "also": [
        18
       ]
      },
      {
       "text": "Line 21 draws again. The if statement is now false, so SwiftUI removes the `Text`, with its transition, and line 10 prints {{removed}}. In an app, the `Text` would fade out.",
       "line": 10,
       "also": [
        21,
        6
       ],
       "prints": [
        "removed"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The `Text` was inserted when the if statement became true, and removed when it became false. Its transition says how it comes in and goes out."
     }
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
  "type-size": {
   "id": "type-size",
   "name": "Text size",
   "first": "One of the sizes that a user can choose for text in Settings, from extra small to the five much larger accessibility sizes.",
   "parts": []
  },
  "underlying-type": {
   "id": "underlying-type",
   "name": "Underlying type",
   "first": "The one real type behind an opaque type, which swiftc works out from the code that makes the value.",
   "parts": []
  },
  "update-ui-view": {
   "id": "update-ui-view",
   "name": "Update method",
   "first": "The method of a representable view that changes its UIKit view to match the SwiftUI view's values, which SwiftUI calls after making the view and again each time the values change.",
   "parts": []
  },
  "updating-callback": {
   "id": "updating-callback",
   "name": "Updating closure",
   "first": "The closure that a gesture is given with a binding to a gesture state property, which sets that property from the gesture's value each time the gesture changes.",
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
  "view-identity": {
   "id": "view-identity",
   "name": "View identity",
   "area": "ui",
   "first": "How SwiftUI tells whether a view in a new description is the same view as before, which keeps its state, or a new view, whose state starts again.",
   "parts": [
    "structural-identity",
    "explicit-identity"
   ],
   "dependsOn": [
    {
     "id": "state",
     "views": [
      "what",
      "parts"
     ],
     "why": "Identity decides whether a view keeps its state or starts it again.",
     "whyInExample": "The property `taps` is state of `Counter`, as it is on the page of State."
    },
    {
     "id": "view-update",
     "views": [
      "parts"
     ],
     "why": "A view that keeps its identity runs its body again only when a value that the body read changes.",
     "whyInExample": "When line 23 gives the renderer a new `Screen`, nothing that the `body` of `Counter` read has changed, as `visits` changed nothing on the page of View update."
    }
   ],
   "example": {
    "code": [
     "import SwiftUI",
     "",
     "struct Counter: View {",
     "    @State private var taps = 0",
     "    var body: some View {",
     "        let _ = print(\"taps is\", taps)",
     "        Text(\"\\(taps)\")",
     "            .onAppear { taps += 1 }",
     "    }",
     "}",
     "",
     "struct Screen: View {",
     "    let version: Int",
     "    var body: some View {",
     "        Counter().id(version)",
     "    }",
     "}",
     "",
     "let first = Screen(version: 1)",
     "let renderer = ImageRenderer(content: first)",
     "_ = renderer.cgImage",
     "print(\"same id\")",
     "renderer.content = Screen(version: 1)",
     "_ = renderer.cgImage",
     "print(\"new id\")",
     "renderer.content = Screen(version: 2)",
     "_ = renderer.cgImage"
    ]
   },
   "views": {
    "what": {
     "is": "A view's identity is how SwiftUI tells whether a view in a new description is the same view as before. The same view keeps its state, and a new view starts its state again. SwiftUI uses the view's place in its parent's `body`, and the value of its `id` modifier when it has one.",
     "marks": [
      {
       "line": 15,
       "text": "Counter()",
       "part": "structural-identity",
       "label": "its place"
      },
      {
       "line": 15,
       "text": "id(version)",
       "part": "explicit-identity",
       "label": "its id"
      }
     ],
     "afterExample": "Lines 23 and 26 give the renderer a new `Screen`. With the same id, `Counter` is the same view, and `taps` stays 1. With a new id, `Counter` is a new view, so `taps` starts again at 0.",
     "problem": "SwiftUI makes a new description of the screen each time a `body` runs, and each description is made of new values. SwiftUI must match each view in it with a view it already has, to keep that view's state, or else make a new view.",
     "how": "Apple's documentation says that when the value given to a view's `id` changes, the view's identity, and with it its state, is reset. A view with no `id` is matched by its place: a view of the same type at the same place in its parent's `body` is the same view.",
     "when": [
      {
       "text": "Use `id` to start a view again on purpose, such as an editor when the user picks a different trip."
      },
      {
       "text": "Don't give `id` a value that changes each time the `body` runs, such as a new random number. Every update would then make a new view, and its state would be lost each time."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "structural-identity",
       "name": "The place of `Counter()`, line 15",
       "text": "The `body` of `Screen` has one view, `Counter()`, at its first place. In each new `Screen`, a `Counter` is at the same place, so by its place it is the same view."
      },
      {
       "part": "explicit-identity",
       "name": "The id, line 15",
       "text": "The modifier `id` gives `Counter` the value of `version` as its id. SwiftUI compares it as well as the place: while it stays 1, the view is the same view, and when it becomes 2, the view is a new view."
      }
     ],
     "marks": [
      {
       "line": 15,
       "text": "Counter()",
       "part": "structural-identity",
       "label": "place"
      },
      {
       "line": 15,
       "text": "id(version)",
       "part": "explicit-identity",
       "label": "id"
      }
     ],
     "steps": [
      {
       "text": "Line 19 makes a `Screen` with version 1, and line 20 makes a renderer. Line 21 asks for the image, so SwiftUI makes a `Counter` with id 1, whose `taps` is 0.",
       "line": 21,
       "also": [
        19,
        20,
        15
       ]
      },
      {
       "text": "The `body` of `Counter` runs, and line 6 prints {{taps is 0}}.",
       "line": 6,
       "prints": [
        "taps is 0"
       ]
      },
      {
       "text": "The `Text` appears, and line 8 adds 1 to `taps`, so the `body` runs again, and line 6 prints {{taps is 1}}.",
       "line": 6,
       "also": [
        8
       ],
       "prints": [
        "taps is 1"
       ]
      },
      {
       "text": "Line 22 prints {{same id}}.",
       "line": 22,
       "prints": [
        "same id"
       ]
      },
      {
       "text": "Line 23 gives the renderer a new `Screen`, with version 1 again, and line 24 draws it. The `Counter` is at the same place with the same id, so it is the same view, and `taps` is still 1. Nothing that its `body` read changed, so the `body` does not run.",
       "line": 23,
       "also": [
        24
       ]
      },
      {
       "text": "Line 25 prints {{new id}}.",
       "line": 25,
       "prints": [
        "new id"
       ]
      },
      {
       "text": "Line 26 gives the renderer a `Screen` with version 2, and line 27 draws it. The id changed, so SwiftUI removes the old `Counter` and makes a new one, whose `taps` starts at 0. Line 6 prints {{taps is 0}}.",
       "line": 6,
       "also": [
        26,
        27
       ],
       "prints": [
        "taps is 0"
       ]
      },
      {
       "text": "The new `Text` appears, line 8 adds 1 to `taps`, and line 6 prints {{taps is 1}}.",
       "line": 6,
       "also": [
        8
       ],
       "prints": [
        "taps is 1"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The same place and the same id kept the view and its state. A new id made a new view, whose state started again."
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
  "widget": {
   "id": "widget",
   "name": "Widget",
   "area": "ui",
   "first": "A view that the system shows outside the app, such as on the Home Screen, from a timeline of entries that the app gives it ahead of time.",
   "parts": [
    "timeline-entry",
    "timeline",
    "reload-policy"
   ],
   "dependsOn": [
    {
     "id": "view",
     "views": [
      "what"
     ],
     "why": "A widget's content is a SwiftUI view, made from one entry of its timeline.",
     "whyInExample": "For each entry, the widget would show a view, such as `Greeting` on the page of View, made from the entry's `nights`."
    },
    {
     "id": "protocol",
     "views": [
      "parts"
     ],
     "why": "An entry is a type that conforms to WidgetKit's protocol for timeline entries.",
     "whyInExample": "The type `Entry` conforms to `TimelineEntry` by having `date`, as `Friendly` conforms to `Greeter` by having `greet(name:)`."
    }
   ],
   "example": {
    "code": [
     "import WidgetKit",
     "import SwiftUI",
     "",
     "struct Entry: TimelineEntry {",
     "    let date: Date",
     "    let nights: Int",
     "}",
     "",
     "let start = Date(timeIntervalSince1970: 0)",
     "var entries: [Entry] = []",
     "for day in 0..<3 {",
     "    let date = start + Double(day * 86400)",
     "    let entry = Entry(date: date, nights: 3 - day)",
     "    entries.append(entry)",
     "}",
     "let timeline = Timeline(",
     "    entries: entries, policy: .atEnd",
     ")",
     "for entry in timeline.entries {",
     "    let seconds = entry.date.timeIntervalSince1970",
     "    let day = Int(seconds) / 86400",
     "    print(\"day\", day, entry.nights)",
     "}"
    ]
   },
   "views": {
    "what": {
     "is": "A widget is a view that the system shows outside the app, such as on the Home Screen. The app does not run while its widget is shown. Ahead of time, it gives the system a timeline: a list of entries, each with a date and the data for the widget's view at that date. Apple's documentation says that WidgetKit shows the view for each entry at the entry's date, or later.",
     "marks": [
      {
       "line": 4,
       "text": "TimelineEntry",
       "part": "timeline-entry",
       "label": "one entry"
      },
      {
       "line": 16,
       "text": "Timeline",
       "part": "timeline",
       "label": "the entries"
      },
      {
       "line": 17,
       "text": ".atEnd",
       "part": "reload-policy",
       "label": "when to ask again"
      }
     ],
     "afterExample": "The timeline has three entries, one a day apart, which count down the nights left before a trip: 3, then 2, then 1. The policy `.atEnd` asks the system for a new timeline after the last date.",
     "problem": "People want to see a little of an app without opening it, such as how many nights are left before a trip. Running the app each time the user looks would use up the battery. A widget's views come from a timeline made ahead of time, which the system shows by itself.",
     "how": "In a widget extension, a timeline provider, a type that the widget's code has, gives the system each timeline. To show an entry, Apple's documentation says that WidgetKit runs the widget's content with that entry, which returns the view. It also says that the policy `.atEnd` tells WidgetKit to ask for a new timeline after the last date has passed.",
     "when": [
      {
       "text": "Use a widget for a small piece of information that people check often, such as the nights left before a trip."
      },
      {
       "text": "Don't use a widget for work that the user does, such as editing a trip. A widget shows data that was made ahead of time, and the work belongs in the app."
      }
     ]
    },
    "parts": {
     "parts": [
      {
       "part": "timeline-entry",
       "name": "The entry type `Entry`, lines 4 to 7",
       "text": "A type that conforms to `TimelineEntry` has a `date`, when its view should be shown, and the data that the view needs, here `nights`."
      },
      {
       "part": "timeline",
       "name": "The timeline, lines 16 to 18",
       "text": "A `Timeline` holds the entries, in the order of their dates, and a policy. A timeline provider returns one when the system asks it for the next timeline."
      },
      {
       "part": "reload-policy",
       "name": "The policy `.atEnd`, line 17",
       "text": "The policy says when the system asks for the next timeline. The policy `.atEnd` asks after the date of the last entry has passed."
      }
     ],
     "marks": [
      {
       "line": 4,
       "text": "TimelineEntry",
       "part": "timeline-entry",
       "label": "entry"
      },
      {
       "line": 16,
       "text": "Timeline",
       "part": "timeline",
       "label": "timeline"
      },
      {
       "line": 17,
       "text": ".atEnd",
       "part": "reload-policy",
       "label": "policy"
      }
     ],
     "steps": [
      {
       "text": "Line 9 takes a starting date. Lines 11 to 15 make three entries, one day apart, with 3, 2, and 1 nights left.",
       "line": 13,
       "also": [
        9,
        11,
        12,
        14
       ]
      },
      {
       "text": "Lines 16 to 18 make a timeline of the entries, with the policy `.atEnd`.",
       "line": 16,
       "also": [
        17
       ]
      },
      {
       "text": "Lines 19 to 23 go through the timeline's entries, and print the day of each one and its nights: {{day 0 3}}, {{day 1 2}}, and {{day 2 1}}. On each of those days, the system would show the widget's view for that entry.",
       "line": 22,
       "also": [
        19,
        20,
        21
       ],
       "prints": [
        "day 0 3",
        "day 1 2",
        "day 2 1"
       ]
      }
     ],
     "end": {
      "kind": "answer",
      "text": "The timeline held a view's data for each day ahead of time, so the system can show the widget without running the app."
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
  "with-animation": {
   "id": "with-animation",
   "name": "Animated change",
   "first": "A call that runs a closure and animates the changes of state that the closure makes, with the animation it is given.",
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
  }
 ]
};
