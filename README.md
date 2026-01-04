# Europe@War (EaW) - Online Strategy Board Game

A web-based multiplayer strategy board game inspired by classic World War II tabletop games like Axis & Allies. This is a Node.js-based gaming framework featuring real-time multiplayer gameplay, an interactive SVG-based game board, and a 3D physics-based dice roller.

## 🎮 Project Overview

**Europe@War** is a digital adaptation of a strategic war game set in World War II Europe. Players control major world powers (Germany, United Kingdom, Soviet Union, France, United States, and Italy) competing for territorial control across a detailed map of Europe, North Africa, and the Middle East.

### Game Tagline
> "It Comes For You."

### Key Features

- **Real-time Multiplayer**: Synchronized gameplay using Socket.IO
- **Interactive Map**: SVG-based game board with over 300 zones across Europe, North Africa, and the Middle East
- **Drag-and-Drop Units**: Intuitive unit placement and movement
- **Turn-Based Strategy**: Nation-by-nation turn system with economic (IPC) management
- **3D Dice Roller**: Physics-based dice rolling using Three.js and Cannon.js
- **Game State Persistence**: PostgreSQL-backed save/load functionality
- **Session Management**: Redis-based session storage with authentication

---

## 🏗️ Architecture

### Technology Stack

#### Backend (Node.js)
- **Express.js 4.4.4**: Web application framework
- **Socket.IO 1.3.5**: Real-time bidirectional communication
- **Passport.js**: Authentication middleware with local strategy
- **PostgreSQL 3.x**: Game state and user data persistence
- **Redis**: Session store via connect-redis
- **bcrypt**: Password hashing (currently disabled in code)

#### Frontend
- **Snap.svg**: SVG manipulation and rendering for game board
- **jQuery 2.1.1**: DOM manipulation and event handling
- **jQuery UI**: Drag-and-drop functionality
- **Bootstrap 3**: UI components and styling
- **Three.js**: 3D rendering for dice
- **Cannon.js**: Physics engine for dice rolling

#### Infrastructure
- **Heroku**: Deployment platform (via Procfile)
- **RedisCloud**: Cloud-hosted Redis service
- **Environment Variables**: Configuration via dotenv

### Application Structure

```
eaw/
├── index.js                 # Main server entry point
├── package.json            # Dependencies and metadata
├── Procfile               # Heroku deployment config
├── .env                   # Environment variables (gitignored)
│
├── js/                    # Client-side JavaScript
│   ├── init.js           # Game initialization
│   ├── eaw.js            # Core game engine
│   ├── eaw.zones.js      # Zone/territory management
│   ├── eaw.nations.js    # Nation definitions and logic
│   ├── eaw.elements.js   # Game pieces (units) definitions
│   ├── eaw.ui.js         # User interface controls
│   ├── eaw.io.js         # Socket.IO client communication
│   ├── eaw.dice.js       # Dice roller integration
│   ├── eaw_db.js         # Database operations (server-side)
│   └── eaw_auth.js       # Authentication logic (server-side)
│
├── dice/                  # 3D dice roller
│   ├── dice.js           # Dice physics and rendering
│   └── main.js           # Dice initialization
│
├── images/               # Game assets (SVG units, map, icons)
│   └── eaw.svg          # Complete map with zone paths
│
├── css/                  # Stylesheets
│   ├── eaw.css          # Custom game styles
│   └── bootstrap.min.css
│
├── libs/                 # Third-party libraries
│   ├── snap.svg-min.js
│   ├── socket.io.js
│   ├── three.min.js
│   └── cannon.min.js
│
└── *.html               # HTML pages
    ├── index.html       # Main game interface
    ├── login.html       # Authentication page
    └── dice.html        # Dice roller page
```

---

## 🎯 Game Mechanics

### Nations and Alliances

**Playable Major Powers:**
- **Axis**: Germany (de), Italy (it)
- **Allies**: United Kingdom (uk), France (fr), United States (us)
- **Russia**: Soviet Union (ru)

**Neutral Nations:**
All major European neutral countries are represented (Spain, Turkey, Sweden, etc.) and can potentially be invaded or influenced.

### Game Board

The map consists of approximately **302 zones** divided into:

1. **Land Zones** (~240 zones)
   - Territory name (e.g., "Berlin", "Paris", "Moscow")
   - Owner nation
   - Factory presence (industrial capacity)
   - IPC (Industrial Production Certificate) value
   - Current occupation status

2. **Sea Zones** (~62 zones)
   - Major harbors for naval operations
   - Named zones (e.g., "English Channel", "Mediterranean")
   - Convoy routes

### Unit Types

**Land Units:**
- Infantry
- Artillery
- Armor (Tanks)

**Air Units:**
- Fighters
- Bombers

**Naval Units:**
- Submarines
- Cruisers
- Battleships
- Carriers
- Transports

Each unit type has:
- SVG path definition for rendering
- Nation-specific color gradients
- Drag-and-drop capabilities
- Unique identifier for multiplayer sync

### Game Flow

1. **Initialization**: Game loads with starting nation positions
2. **Turn System**: Nations take turns sequentially (cyclic order)
3. **Unit Placement**: Players drag units from side panel to map zones
4. **Combat Resolution**: Contested zones trigger combat (dice rolling)
5. **Economic Phase**: IPC collection based on controlled territories
6. **Technology**: Tech tree for unit upgrades (framework in place)
7. **Diplomacy**: Nation relations and declarations (framework in place)

### Zone Mechanics

- **Contested Zones**: Zones with units from multiple alliances
- **Zone Ownership**: Determined by unit presence and combat resolution
- **Factory Zones**: Can produce units (shown with point values)
- **Unit Stacking**: Visual chip system (white chips = 1 unit, red chips = 5 units)

---

## 💻 Code Patterns and Design

### Object-Oriented JavaScript

The codebase uses **prototypal inheritance** for game entities:

```javascript
// Base class
eaw.GameElement (all pieces on board)
  └── Unit (draggable military units)
      ├── Infantry
      ├── Armor
      ├── Fighter
      ├── Bomber
      ├── Battleship
      ├── Carrier
      ├── Submarine
      ├── Cruiser
      └── Transport

// Zones
eaw.Zone
  ├── LandZone (territories)
  └── SeaZone (naval areas)

// Game State
eaw.Game (singleton managing game state)
eaw.Nation (player-controllable factions)
```

### Key Design Patterns

1. **Namespace Pattern**: All game code under `eaw` namespace to avoid global pollution
2. **Module Pattern**: Server-side code uses CommonJS modules
3. **Observer Pattern**: Socket.IO events for multiplayer synchronization
4. **Factory Pattern**: `eaw.createUnit(type, params)` for unit creation
5. **Singleton Pattern**: `eaw.game` represents the current game instance

### Event-Driven Architecture

**Server-Side Events (index.js):**
```javascript
socket.on('unit_dropped')      // Player places/moves unit
socket.on('unit_dragging')     // Unit drag in progress
socket.on('new_save_game')     // Save game state
socket.on('request_save_game') // Load game state
```

**Client-Side Events (eaw.io.js):**
```javascript
socket.emit('unit_dropped', data)    // Notify server of move
socket.on('unit_drop_notify', data)  // Receive opponent move
socket.on('onconnected', data)       // Connection established
```

### State Management

**Game State Object:**
```javascript
eaw.Game {
  PLAYABLE_NATIONS: [],      // Active nations
  GAME_TURN: 0,             // Current turn number
  CURRENT_NATION: {},       // Active player
  CURRENT_NATION_INDEX: 0,  // Turn order index
  GAME_PIECES: [],          // All units on board
  ZONE_SET: []              // All map zones
}
```

**Serialization**: Game state serialized to JSON (excluding UI elements) for database storage.

---

## 🚀 Setup and Deployment

### Environment Variables

Create a `.env` file with:

```bash
# Database
DB_HOST=your-postgres-host
DB_USER=your-db-user
DB_PW=your-db-password
DB_NAME=your-db-name
DB_PORT=5432

# Redis
REDISCLOUD_URL=redis://user:password@host:port

# Server
PORT=5000
NODE_ENV=production
```

### Database Schema

**Required Tables:**

```sql
-- Users table
CREATE TABLE eaw.users (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255),
    displayname VARCHAR(255)
);

-- Save games table
CREATE TABLE eaw.save_games (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    created_datetime TIMESTAMP,
    modified_datetime TIMESTAMP,
    game_data TEXT
);
```

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env  # Edit with your credentials

# Run locally
node index.js

# Or use Heroku
heroku create your-app-name
git push heroku main
```

### Dependencies

**Production:**
- bcrypt 1.0.2 - Password hashing
- body-parser 1.12.2 - HTTP request body parsing
- connect-flash 0.1.1 - Flash message middleware
- connect-redis 2.0.0 - Redis session store adapter
- dotenv ^4.0.0 - Environment variable management
- express 4.4.4 - Web application framework
- express-session 1.10.4 - Session middleware
- logfmt 1.1.2 - Structured logging for Heroku
- nodetime x.x - Application performance monitoring
- passport 0.2.1 - Authentication middleware
- passport-local 1.0.0 - Local authentication strategy
- pg 3.x - PostgreSQL client
- redis 0.12.1 - Redis client
- socket.io 1.3.5 - Real-time communication

**Target Platform:**
- Node.js 4.8.4
- npm 2.1.x

---

## 🎲 Special Features

### 3D Dice Roller

A separate window (`dice.html`) provides a physics-simulated dice roller:
- Uses **Three.js** for 3D rendering
- **Cannon.js** physics engine for realistic dice behavior
- Real-time results shared via Socket.IO
- Configurable dice sets (e.g., "3d6" for 3 six-sided dice)

### Session & Authentication

- **Passport.js** local strategy for username/password auth
- **Redis session store** for scalability
- **Cookie-based** Socket.IO authentication
- Session persistence across page reloads
- Automatic logout for invalid/expired sessions

### Multiplayer Synchronization

- **Real-time unit movement** broadcast to all players
- **Optimistic UI updates** with server confirmation
- **Network game detection** to prevent local-only actions from broadcasting
- **Session-based** player identification

### Save/Load System

- **JSON serialization** of entire game state
- **PostgreSQL storage** with timestamps
- **Default game template** for new games
- Selective serialization (excludes Snap.svg internals)

---

## 📊 Game Data

### Zone Properties

Each zone defined in `eaw.ZoneProperties`:
```javascript
Berlin: {
  type: "land",           // "land" or "sea"
  owner: "de",           // Starting owner nation code
  hasFactory: true,      // Can produce units
  pointValue: 2,         // IPC value
  center: {x: 0, y: 0}  // Label positioning offset
}
```

### Nation Properties

Defined in `eaw.nations.StartingNationProperties`:
```javascript
de: {
  name: "Germany",
  alliance: "axis",
  unit_name: "German",
  cash: 0,
  id: "de"
}
```

### Unit Rendering

Units rendered with **SVG path data** and **nation-specific gradients**:
- Germany: Gray gradient
- UK: Tan gradient  
- France: Blue gradient
- Italy: Yellow/gold gradient
- US: Green gradient
- Russia: Brown gradient

---

## 🔧 Development Notes

### Known Patterns

1. **Global State**: `eaw` namespace contains all game state
2. **jQuery Dependency**: Heavy reliance on jQuery for DOM manipulation
3. **Snap.svg**: Primary rendering engine for game board
4. **Event Handlers**: Mix of jQuery `.on()` and native event listeners
5. **Async Loading**: `$.getScript()` for dynamic script loading

### Code Organization

- **Client/Server Separation**: Clear division between browser and Node.js code
- **Modular Design**: Each game aspect (zones, nations, units, UI) in separate files
- **Configuration-Driven**: Zone and nation properties externalized
- **SVG-Based**: All game graphics defined as SVG paths, not raster images

### UI/UX Patterns

- **Bootstrap Modals**: For menus, tech trees, IPC displays
- **Drag-and-Drop**: jQuery UI draggable/droppable
- **Navbar Navigation**: Bootstrap navbar with custom subnav panels
- **Color Coding**: Nation-specific color schemes throughout UI

### Security Considerations

⚠️ **Current Implementation Notes:**
- Password comparison currently bypassed (`comparePassword` returns `true`)
- SQL queries use string concatenation (SQL injection risk)
- No input validation on database operations
- Session secret hardcoded in `index.js`

*These should be addressed before production deployment.*

---

## 🎨 Visual Design

### Login Screen
- Rotating historical WWII background images (58 images on 5-second intervals)
- Custom styled form with military color scheme (#AAAD3D gold accents)
- Clean, minimalist interface

### Game Board
- SVG-rendered map with zone boundaries
- Zone names and IPC values overlaid
- Unit pieces with nation colors
- Visual stacking indicators (chips)
- Flash animations on unit placement

### Navigation
- Top navbar with game phases (Units, Tech, IPCs, Cards, Diplomacy, Menu, Dice)
- Collapsible side panels for unit selection
- Left/Right nation switching buttons
- Modal dialogs for complex interactions

---

## 📝 API Reference

### Socket.IO Events

**Client → Server:**
- `unit_dropped(messageJSON)`: Unit placement complete
- `unit_dragging(messageJSON)`: Unit being moved
- `new_save_game(gameStateJSON)`: Save current game
- `new_default_save_game(gameStateJSON)`: Save as default template
- `request_save_game(saveName, callback)`: Load saved game

**Server → Client:**
- `onconnected({id, user})`: Connection established
- `unit_drop_notify(messageJSON)`: Opponent placed unit
- `unit_dragging_notify(messageJSON)`: Opponent moving unit
- `logout_client()`: Force logout (invalid session)

### Database Operations (eaw_db.js)

```javascript
getUserInfo(username, callback)           // Fetch user credentials
saveGame(gameStateJSON)                   // Save game to database
saveBaseGame(gameStateJSON)              // Update default game
loadGame(gameName, callback)             // Load saved game
```

### Core Game Methods (eaw.js)

```javascript
eaw.createUnit(type, params)             // Factory for unit creation
eaw.loadGame(saveName)                   // Load and restore game state
eaw.removeAllPieces()                    // Clear board
eaw.Game.save()                          // Serialize game
eaw.Game.nextNation()                    // Advance turn
eaw.Game.previousNation()                // Rewind turn
```

---

## 🌟 Future Enhancements

The codebase has frameworks in place for:

1. **Technology System**: Modal exists, backend logic needed
2. **Card System**: UI placeholder, mechanics not implemented
3. **Diplomacy**: Framework present, rules needed
4. **Combat Resolution**: Dice roller exists, combat logic framework present
5. **Economic System**: IPC calculation complete, purchase system needed
6. **AI Opponents**: Structure supports, AI logic not implemented
7. **Mobile Support**: Responsive design partial, touch events needed

---

## 📖 Historical Context

This game is inspired by classic board games like:
- **Axis & Allies** (Milton Bradley/Avalon Hill)
- **Third Reich** (Avalon Hill)
- **Advanced Third Reich**

The map represents **World War II European Theater** with historically-based starting positions, though game mechanics are simplified for digital play.

---

## 🤝 Contributing

### Code Style
- Use ES5 JavaScript (Node.js 4.8.4 compatibility)
- Namespace all client code under `eaw`
- Follow existing prototypal inheritance patterns
- Comment complex game logic
- Use meaningful variable names (avoid single letters except iterators)

### Testing
Currently no automated test framework. Manual testing recommended:
1. Create two browser sessions
2. Log in as different users
3. Test multiplayer unit movement
4. Verify game save/load
5. Check zone ownership calculations

---

## 📄 License

BSD License (as specified in package.json)

---

## 👤 Author

**kbromer** - Original developer

Repository: https://github.com/kbromer/eaw

---

## 🏁 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/kbromer/eaw.git
cd eaw

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create .env file with database and Redis credentials

# 4. Initialize database
# Run SQL schema (create users and save_games tables)

# 5. Start the server
node index.js

# 6. Open browser
# Navigate to http://localhost:5000
# Log in and start playing!
```

---

**May your strategies be sound and your dice rolls favorable!** 🎲⚔️
