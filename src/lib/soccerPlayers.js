const soccerPlayers = [
  // ── Premier League ────────────────────────────────────────────────────────

  // Manchester City
  { name: 'Erling Haaland',        team: 'Manchester City',         position: 'ST',  sport: 'Soccer', cardType: 'Patch Jersey' },
  { name: 'Phil Foden',            team: 'Manchester City',         position: 'CAM', sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Kevin De Bruyne',       team: 'Manchester City',         position: 'CAM', sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Rodri',                 team: 'Manchester City',         position: 'CDM', sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Bernardo Silva',        team: 'Manchester City',         position: 'CM',  sport: 'Soccer', cardType: 'Downtown' },

  // Arsenal
  { name: 'Bukayo Saka',           team: 'Arsenal',                 position: 'RW',  sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Martin Odegaard',       team: 'Arsenal',                 position: 'CAM', sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Declan Rice',           team: 'Arsenal',                 position: 'CDM', sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Gabriel Martinelli',    team: 'Arsenal',                 position: 'LW',  sport: 'Soccer', cardType: 'Downtown' },
  { name: 'William Saliba',        team: 'Arsenal',                 position: 'CB',  sport: 'Soccer', cardType: 'Downtown' },

  // Liverpool
  { name: 'Mohamed Salah',         team: 'Liverpool',               position: 'RW',  sport: 'Soccer', cardType: 'Patch Jersey' },
  { name: 'Virgil van Dijk',       team: 'Liverpool',               position: 'CB',  sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Trent Alexander-Arnold', team: 'Liverpool',              position: 'RB',  sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Luis Diaz',             team: 'Liverpool',               position: 'LW',  sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Dominik Szoboszlai',    team: 'Liverpool',               position: 'CAM', sport: 'Soccer', cardType: 'Downtown' },

  // Chelsea
  { name: 'Cole Palmer',           team: 'Chelsea',                 position: 'CAM', sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Enzo Fernandez',        team: 'Chelsea',                 position: 'CM',  sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Moises Caicedo',        team: 'Chelsea',                 position: 'CDM', sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Nicolas Jackson',       team: 'Chelsea',                 position: 'ST',  sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Reece James',           team: 'Chelsea',                 position: 'RB',  sport: 'Soccer', cardType: 'Net to Net' },

  // Manchester United
  { name: 'Bruno Fernandes',       team: 'Manchester United',       position: 'CAM', sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Rasmus Hojlund',        team: 'Manchester United',       position: 'ST',  sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Alejandro Garnacho',    team: 'Manchester United',       position: 'LW',  sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Kobbie Mainoo',         team: 'Manchester United',       position: 'CM',  sport: 'Soccer', cardType: 'Net to Net' },
  { name: 'Lisandro Martinez',     team: 'Manchester United',       position: 'CB',  sport: 'Soccer', cardType: 'Net to Net' },

  // Tottenham Hotspur
  { name: 'Son Heung-min',         team: 'Tottenham Hotspur',       position: 'LW',  sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'James Maddison',        team: 'Tottenham Hotspur',       position: 'CAM', sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Cristian Romero',       team: 'Tottenham Hotspur',       position: 'CB',  sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Dominic Solanke',       team: 'Tottenham Hotspur',       position: 'ST',  sport: 'Soccer', cardType: 'Net to Net' },
  { name: 'Micky van de Ven',      team: 'Tottenham Hotspur',       position: 'CB',  sport: 'Soccer', cardType: 'Net to Net' },

  // Newcastle United
  { name: 'Alexander Isak',        team: 'Newcastle United',        position: 'ST',  sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Bruno Guimaraes',       team: 'Newcastle United',        position: 'CDM', sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Anthony Gordon',        team: 'Newcastle United',        position: 'LW',  sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Kieran Trippier',       team: 'Newcastle United',        position: 'RB',  sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Fabian Schar',          team: 'Newcastle United',        position: 'CB',  sport: 'Soccer', cardType: 'Net to Net' },

  // Aston Villa
  { name: 'Ollie Watkins',         team: 'Aston Villa',             position: 'ST',  sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Emiliano Martinez',     team: 'Aston Villa',             position: 'GK',  sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Leon Bailey',           team: 'Aston Villa',             position: 'LW',  sport: 'Soccer', cardType: 'Net to Net' },
  { name: 'Youri Tielemans',       team: 'Aston Villa',             position: 'CM',  sport: 'Soccer', cardType: 'Net to Net' },
  { name: 'Ezri Konsa',            team: 'Aston Villa',             position: 'CB',  sport: 'Soccer', cardType: 'Parallel' },

  // ── La Liga ───────────────────────────────────────────────────────────────

  // Real Madrid
  { name: 'Vinicius Jr.',          team: 'Real Madrid',             position: 'LW',  sport: 'Soccer', cardType: 'Patch Jersey' },
  { name: 'Jude Bellingham',       team: 'Real Madrid',             position: 'CAM', sport: 'Soccer', cardType: 'Patch Jersey' },
  { name: 'Kylian Mbappe',         team: 'Real Madrid',             position: 'ST',  sport: 'Soccer', cardType: 'Patch Jersey' },
  { name: 'Rodrygo',               team: 'Real Madrid',             position: 'RW',  sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Federico Valverde',     team: 'Real Madrid',             position: 'CM',  sport: 'Soccer', cardType: 'Kaboom' },

  // Barcelona
  { name: 'Lamine Yamal',          team: 'Barcelona',               position: 'RW',  sport: 'Soccer', cardType: 'Patch Jersey' },
  { name: 'Pedri',                 team: 'Barcelona',               position: 'CM',  sport: 'Soccer', cardType: 'Patch Jersey' },
  { name: 'Robert Lewandowski',    team: 'Barcelona',               position: 'ST',  sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Raphinha',              team: 'Barcelona',               position: 'LW',  sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Gavi',                  team: 'Barcelona',               position: 'CM',  sport: 'Soccer', cardType: 'Kaboom' },

  // Atletico Madrid
  { name: 'Antoine Griezmann',     team: 'Atletico Madrid',         position: 'CAM', sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Julian Alvarez',        team: 'Atletico Madrid',         position: 'ST',  sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Jan Oblak',             team: 'Atletico Madrid',         position: 'GK',  sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Rodrigo de Paul',       team: 'Atletico Madrid',         position: 'CM',  sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Marcos Llorente',       team: 'Atletico Madrid',         position: 'CM',  sport: 'Soccer', cardType: 'Downtown' },

  // Athletic Club
  { name: 'Nico Williams',         team: 'Athletic Club',           position: 'LW',  sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Inaki Williams',        team: 'Athletic Club',           position: 'ST',  sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Oihan Sancet',          team: 'Athletic Club',           position: 'CAM', sport: 'Soccer', cardType: 'Net to Net' },
  { name: 'Unai Simon',            team: 'Athletic Club',           position: 'GK',  sport: 'Soccer', cardType: 'Net to Net' },
  { name: 'Dani Vivian',           team: 'Athletic Club',           position: 'CB',  sport: 'Soccer', cardType: 'Parallel' },

  // Real Sociedad
  { name: 'Mikel Oyarzabal',       team: 'Real Sociedad',           position: 'LW',  sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Takefusa Kubo',         team: 'Real Sociedad',           position: 'RW',  sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Martin Zubimendi',      team: 'Real Sociedad',           position: 'CDM', sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Brais Mendez',          team: 'Real Sociedad',           position: 'CM',  sport: 'Soccer', cardType: 'Net to Net' },
  { name: 'Remiro',                team: 'Real Sociedad',           position: 'GK',  sport: 'Soccer', cardType: 'Parallel' },

  // Villarreal
  { name: 'Alexander Sorloth',     team: 'Villarreal',              position: 'ST',  sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Yeremy Pino',           team: 'Villarreal',              position: 'RW',  sport: 'Soccer', cardType: 'Net to Net' },
  { name: 'Dani Parejo',           team: 'Villarreal',              position: 'CM',  sport: 'Soccer', cardType: 'Net to Net' },
  { name: 'Ayoze Perez',           team: 'Villarreal',              position: 'LW',  sport: 'Soccer', cardType: 'Parallel' },
  { name: 'Alfonso Pedraza',       team: 'Villarreal',              position: 'LB',  sport: 'Soccer', cardType: 'Base' },

  // Real Betis
  { name: 'Isco',                  team: 'Real Betis',              position: 'CAM', sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Nabil Fekir',           team: 'Real Betis',              position: 'CAM', sport: 'Soccer', cardType: 'Net to Net' },
  { name: 'William Carvalho',      team: 'Real Betis',              position: 'CDM', sport: 'Soccer', cardType: 'Net to Net' },
  { name: 'Borja Iglesias',        team: 'Real Betis',              position: 'ST',  sport: 'Soccer', cardType: 'Net to Net' },
  { name: 'Marc Bartra',           team: 'Real Betis',              position: 'CB',  sport: 'Soccer', cardType: 'Parallel' },

  // ── Bundesliga ────────────────────────────────────────────────────────────

  // Bayern Munich
  { name: 'Harry Kane',            team: 'Bayern Munich',           position: 'ST',  sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Jamal Musiala',         team: 'Bayern Munich',           position: 'CAM', sport: 'Soccer', cardType: 'Patch Jersey' },
  { name: 'Michael Olise',         team: 'Bayern Munich',           position: 'RW',  sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Joshua Kimmich',        team: 'Bayern Munich',           position: 'CDM', sport: 'Soccer', cardType: 'Kaboom' },
  { name: 'Leroy Sane',            team: 'Bayern Munich',           position: 'LW',  sport: 'Soccer', cardType: 'Downtown' },

  // Bayer Leverkusen
  { name: 'Florian Wirtz',         team: 'Bayer Leverkusen',        position: 'CAM', sport: 'Soccer', cardType: 'Patch Jersey' },
  { name: 'Granit Xhaka',          team: 'Bayer Leverkusen',        position: 'CDM', sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Victor Boniface',       team: 'Bayer Leverkusen',        position: 'ST',  sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Alejandro Grimaldo',    team: 'Bayer Leverkusen',        position: 'LB',  sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Jonathan Tah',          team: 'Bayer Leverkusen',        position: 'CB',  sport: 'Soccer', cardType: 'Net to Net' },

  // Borussia Dortmund
  { name: 'Karim Adeyemi',         team: 'Borussia Dortmund',       position: 'LW',  sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Julian Brandt',         team: 'Borussia Dortmund',       position: 'CAM', sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Maximilian Beier',      team: 'Borussia Dortmund',       position: 'ST',  sport: 'Soccer', cardType: 'Net to Net' },
  { name: 'Emre Can',              team: 'Borussia Dortmund',       position: 'CM',  sport: 'Soccer', cardType: 'Net to Net' },
  { name: 'Gregor Kobel',          team: 'Borussia Dortmund',       position: 'GK',  sport: 'Soccer', cardType: 'Parallel' },

  // RB Leipzig
  { name: 'Lois Openda',           team: 'RB Leipzig',              position: 'ST',  sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Xavi Simons',           team: 'RB Leipzig',              position: 'CAM', sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Benjamin Sesko',        team: 'RB Leipzig',              position: 'ST',  sport: 'Soccer', cardType: 'Downtown' },
  { name: 'David Raum',            team: 'RB Leipzig',              position: 'LB',  sport: 'Soccer', cardType: 'Net to Net' },
  { name: 'Peter Gulacsi',         team: 'RB Leipzig',              position: 'GK',  sport: 'Soccer', cardType: 'Parallel' },

  // VfB Stuttgart
  { name: 'Deniz Undav',           team: 'VfB Stuttgart',           position: 'ST',  sport: 'Soccer', cardType: 'Downtown' },
  { name: 'Angelo Stiller',        team: 'VfB Stuttgart',           position: 'CDM', sport: 'Soccer', cardType: 'Net to Net' },
  { name: 'Enzo Millot',           team: 'VfB Stuttgart',           position: 'CM',  sport: 'Soccer', cardType: 'Net to Net' },
  { name: 'Chris Fuhrlich',        team: 'VfB Stuttgart',           position: 'LW',  sport: 'Soccer', cardType: 'Parallel' },
  { name: 'Alexander Nubel',       team: 'VfB Stuttgart',           position: 'GK',  sport: 'Soccer', cardType: 'Parallel' },
]

export default soccerPlayers
