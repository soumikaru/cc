function w(val) {
  if (val == null)
    return width;
  return val * width;
}

function h(val) {
  if (val == null)
    return height;
  return val * height;
}

function makeCircle(numSides, radius) {
  const points = [];
  const radiansPerStep = (Math.PI * 2) / numSides;

  for (let theta = 0; theta < Math.PI * 2; theta += radiansPerStep) {
    const x = 0.5 + radius * Math.cos(theta);
    const y = 0.5 + radius * Math.sin(theta);
    points.push([x, y]);
  }

  return points;
}

function distortPolygon(polygon) {
  return polygon.map(point => {
      const x = point[0];
      const y = point[1];
      const distance = dist(0.5, 0.5, x, y);

      const noiseFn = (x, y) => {
        const noiseX = (x + 0.40) * distance * 2;
        const noiseY = (y - 1.60) * distance * 2;
        return noise(noiseX, noiseY, frameCount/200);
      }

      const theta = noiseFn(x, y) * Math.PI * 2;

      const amountToNudge = 0.1;
      const newX = x + (amountToNudge * Math.cos(theta));
      const newY = y + (amountToNudge * Math.sin(theta));

      return [newX, newY];
  });
}

function chaikin(arr, num) {
  if (num === 0) return arr;
  const l = arr.length;
  const smooth = arr.map((c,i) => {
    return [
      [0.75*c[0] + 0.25*arr[(i + 1)%l][0],0.75*c[1] + 0.25*arr[(i + 1)%l][1]],
      [0.25*c[0] + 0.75*arr[(i + 1)%l][0],0.25*c[1] + 0.75*arr[(i + 1)%l][1]]
    ];
  }).flat();
  return num === 1 ? smooth : chaikin(smooth, num - 1);
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background('rgba(0%,70%,45%,0.2)') 
  noFill();               // no fill
  stroke(200, 214, 10);      
  strokeWeight(w(0.003)); // light stroke weight(255);

  for(let radius = 0.05; radius < 0.8; radius += 0.008) {
    const circle = makeCircle(30, radius);
    const distortedCircle = distortPolygon(circle);
    const smoothCircle = chaikin(distortedCircle, 5);

    beginShape();
    distortedCircle.forEach(point => {
      vertex(w(point[0]), h(point[1]));
    });
    endShape(CLOSE); // CLOSE because the last point is not the first point
  }
}