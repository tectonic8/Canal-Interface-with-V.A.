class Target {
  constructor(d, id, index, type) { //type is 0, 1, or 2, representing tagged, user verify, and va verify.
    var target = document.getElementById(id + index);
    target.setAttribute("width", 50);
    target.setAttribute("height", 50);
    target.setAttribute("class", "target");
    target.xPos = Map.d2x(d);
    target.yPos = Map.d2y(d);
    target.style.left = target.xPos + "px";
    target.style.top = target.yPos + "px";
    
    var targetSprite = document.getElementById("miniTarget" + index);
    targetSprite.setAttribute("width", 15);
    targetSprite.setAttribute("height", 15);
    targetSprite.setAttribute("class", "target");
    targetSprite.style.left = (Map.d2x(d)-93)*0.048 + 501 + "px";
    targetSprite.style.top = (Map.d2y(d)-452)*0.046 + 691 + "px";
    if (type == 0) {
      target.setAttribute("src", "target.png");
      targetSprite.setAttribute("src", "miniTarget.png");
    }
    if (type == 1) {
      target.setAttribute("src", "target2.png");
      targetSprite.setAttribute("src", "target2.png");
    }
    if (type == 2) {
      target.setAttribute("src", "target3.png");
      targetSprite.setAttribute("src", "target3.png");
    }
  }
}