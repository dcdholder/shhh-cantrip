class Game {
  constructor() {
    this.app  = new PIXI.Application({width: Game.canvasSize.x, height: Game.canvasSize.y, antialias: true, resolution: 1});
    this.room = new Room(app,)
  }

  static get pixelsPerUnit() { return 10; }
  static get canvasSize()    { return {x: 1200, y:800}; }
}

class Character {
  constructor(app,config) {
    this.position = config.position;
    this.size     = config.size;
    this.color    = config.color;

    this.graphics = Character.getInitialGraphics();
  }

  static get borderThickness() { return 2; }
  static get borderColor()     { return 0xFFFFFF; }

  static getInitialGraphics() {
    var graphics = new PIXI.Graphics();

    graphics.beginFill(this.color);
    graphics.lineStyle(Character.borderThickness,Character.borderColor,1);
    graphics.drawCircle(0,0,this.size/Game.pixelsPerUnit);
    graphics.endFill();

    app.stage.addChild(graphics);
  }
}

class Pc extends Character {
  constructor(app,position) {
    super(app,{position: position, size:Npc.npcSize, color:Npc.npcColor});
  }

  static get pcColor() { return 0x00FF00; }
  static get pcSize()  { return 1.0; }
}

class Npc extends Character {
  constructor(app,position) {
    super(app,{position: position, size:Npc.npcSize, color:Npc.npcColor});
  }

  static get npcColor() { return 0xFF0000; }
  static get npcSize()  { return 1.0; }
}

class Tile {
  constructor(position,isWall) {
    this.isWall   = isWall;
    this.position = position;

    this.graphics = Tile.getInitialGraphics();
  }

  static getInitialGraphics() {

  }

  isWall() {
    return this.isWall;
  }

  distance(position) {
    return Math.sqrt(Math.pow(Math.abs(this.position.x-position.x),2)+Math.pow(Math.abs(this.position.y-position.y)));
  }
}

class Grid {
  constructor(wallArray) {
    this.tileArray = [];
    for (let indexY in wallArray) {
      for (let indexX in wallArray[indexY]) {
        let wallOrFloor = wallArray[indexY][indexX];
        this.tileArray.push(new Tile({x: indexX, y: indexY},wallOrFloor));
      }
    }

    this.numRows = this.tileArray.length;
    this.numCols = this.tileArray[0].length;
  }

  static get maxMinimumDistanceToReflectionDestination() { return 0.05; }

  static distance(source,destination) {
    return Math.sqrt(Math.pow(abs(source.x-destination.x),2)+Math.pow(abs(source.y-destination.y),2));
  }

  //TODO: implement this
  static rayTrace() {

  }

  //TODO: implement this
  static minDistanceFromLineSegment() {

  }

  //returns either a series of points, or nothing at all if a reflection path cannot be found
  static getExactReflectionPath(source,destination,maximumReflections) {
    var potentialImages = [];

    var reflectionPath;
    var minDistanceFromDestination = 10000.0;

    for (let i=0;i<maximumReflections;i++) {
      potentialImages = Grid.getPotentialReflectionImages(i);

      for (let potentialImageIndex in potentialImages) {
        reflectionPath = Grid.rayTrace(source,potentialImages[potentialImageIndex],i);

        if (reflectionPath.length>=2) {
          let distanceFromDestination = Grid.minDistanceFromLineSegment(destination,reflectionPath[reflationPath.length-2],reflectionPath[reflationPath.length-1]);

          if (distanceFromDestination<minDistanceFromDestination) {
            minDistanceFromDestination     = distanceFromDestination;
            minDistanceFromDestinationPath = reflectionPath;
          }
        }
      }
    }

    if (minDistanceFromDestination<Grid.maxMinimumDistanceToReflectionDestination) {
      return minDistanceFromDestinationPath;
    } else {
      return undefined;
    }
  }

  static getPotentialReflectionImages(destination,numReflections) {
    var destinations = [destination];

    for (let i=0;i<numReflections;i++) {
      let newDestinations = [];
      for (let destinationIndex in destinations) {
        let oldDestination = destinations[destinationIndex];
        let newDestinations.push(...Grid.getPotentialSingleReflectionImages(oldDestination));
      }
      destinations = newDestinations;
    }

    return destinations;
  }

  static getPotentialSingleReflectionImages(destination) {
    var reflectedDestinations = [];
    var reflectedDestination;

    //use each row as a reflection axis
    for (let rowIndex=0;rowIndex<this.numRows;rowIndex++) {
      if (destination.y<rowIndex) {
        reflectedDestination.y = rowIndex + (rowIndex - destination.y);
      } else {
        reflectedDestination.y = rowIndex - (destination.y - rowIndex);
      }
      reflectedDestination.x = destination.x;
      reflectedDestinations.push(reflectedDestination);
    }

    //use each column as a reflection axis
    for (let colIndex=0;colIndex<this.numCols;colIndex++) {
      if (destination.x<colIndex) {
        reflectedDestination.x = colIndex + (colIndex - destination.x);
      } else {
        reflectedDestination.x = colIndex - (destination.x - colIndex);
      }
      reflectedDestination.y = destination.y;
      reflectedDestinations.push(reflectedDestination);
    }

    return reflectedDestinations;
  }
}

class Room {
  constructor(app,pcConfig,npcConfigs,wallArray) {
    this.grid = new Grid(wallArray);
    this.pc   = new Pc(app,pcPosition);

    this.npcs = [];
    for(let npcPositionIndex in npcPositions) {
      this.npcs.push(new Npc(app,npcPositions[npcPositionIndex]));
    }
  }
}
