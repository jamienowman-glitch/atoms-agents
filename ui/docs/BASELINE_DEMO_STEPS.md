# Baseline Demo Steps
**Run these steps to verify the "Before" and "After" states are identical.**

1.  **Load App**: Open `http://localhost:3000`.
    *   *Expect*: Header "Northstar Builder". Left Sidebar with existing sections. Right Inspector empty or showing "No Selection".
2.  **Add Section**:
    *   Click "+ Rich Text" at bottom of Sidebar.
    *   *Expect*: New "Rich Text" section appears at bottom. It contains nested "Heading" and "Text" items in Sidebar.
3.  **Add Block**:
    *   Expand the new "Rich Text" section in Sidebar.
    *   Click "+ Text" button inside the sidebar item.
    *   *Expect*: A new Text block is added to the canvas inside that section.
4.  **Edit Text (Human)**:
    *   Double-click the "Heading" on the canvas.
    *   Type "Verified Human Edit". Click away.
    *   *Expect*: Text updates. Selection border remains.
5.  **Edit Text (Agent)**:
    *   Select a Text block.
    *   In Inspector, click "✨ Write Copy".
    *   *Expect*: Text clears, then types out "Agent is writing copy..." character by character.
6.  **Styling**:
    *   Select the Hero Banner.
    *   Change Background Color in Inspector.
    *   *Expect*: Background updates instantly.
7.  **Reorder**:
    *   Drag "Rich Text" above "Hero Banner" in Sidebar.
    *   *Expect*: Canvas updates order.
