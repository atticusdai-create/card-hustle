const mlbPlayers = [
  // ── New York Yankees ──────────────────────────────────────────────────────
  { name: 'Aaron Judge',           team: 'New York Yankees',        position: 'RF',  sport: 'Baseball', cardType: 'Patch Jersey' },
  { name: 'Juan Soto',             team: 'New York Yankees',        position: 'LF',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Gerrit Cole',           team: 'New York Yankees',        position: 'SP',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Jazz Chisholm Jr.',     team: 'New York Yankees',        position: '2B',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Giancarlo Stanton',     team: 'New York Yankees',        position: 'DH',  sport: 'Baseball', cardType: 'Downtown' },

  // ── Boston Red Sox ────────────────────────────────────────────────────────
  { name: 'Rafael Devers',         team: 'Boston Red Sox',          position: '3B',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Jarren Duran',          team: 'Boston Red Sox',          position: 'CF',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Garrett Crochet',       team: 'Boston Red Sox',          position: 'SP',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Alex Bregman',          team: 'Boston Red Sox',          position: '3B',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Brayan Bello',          team: 'Boston Red Sox',          position: 'SP',  sport: 'Baseball', cardType: 'Net to Net' },

  // ── Tampa Bay Rays ────────────────────────────────────────────────────────
  { name: 'Shane McClanahan',      team: 'Tampa Bay Rays',          position: 'SP',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Yandy Diaz',            team: 'Tampa Bay Rays',          position: '1B',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Zach Eflin',            team: 'Tampa Bay Rays',          position: 'SP',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Brandon Lowe',          team: 'Tampa Bay Rays',          position: '2B',  sport: 'Baseball', cardType: 'Parallel' },
  { name: 'Jose Siri',             team: 'Tampa Bay Rays',          position: 'CF',  sport: 'Baseball', cardType: 'Base' },

  // ── Toronto Blue Jays ─────────────────────────────────────────────────────
  { name: 'Vladimir Guerrero Jr.', team: 'Toronto Blue Jays',       position: '1B',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Bo Bichette',           team: 'Toronto Blue Jays',       position: 'SS',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Kevin Gausman',         team: 'Toronto Blue Jays',       position: 'SP',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'George Springer',       team: 'Toronto Blue Jays',       position: 'CF',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Alejandro Kirk',        team: 'Toronto Blue Jays',       position: 'C',   sport: 'Baseball', cardType: 'Parallel' },

  // ── Baltimore Orioles ─────────────────────────────────────────────────────
  { name: 'Gunnar Henderson',      team: 'Baltimore Orioles',       position: 'SS',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Adley Rutschman',       team: 'Baltimore Orioles',       position: 'C',   sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Jackson Holliday',      team: 'Baltimore Orioles',       position: '2B',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Anthony Santander',     team: 'Baltimore Orioles',       position: 'RF',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Cedric Mullins',        team: 'Baltimore Orioles',       position: 'CF',  sport: 'Baseball', cardType: 'Parallel' },

  // ── Cleveland Guardians ───────────────────────────────────────────────────
  { name: 'Jose Ramirez',          team: 'Cleveland Guardians',     position: '3B',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Shane Bieber',          team: 'Cleveland Guardians',     position: 'SP',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Emmanuel Clase',        team: 'Cleveland Guardians',     position: 'RP',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Josh Naylor',           team: 'Cleveland Guardians',     position: '1B',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Steven Kwan',           team: 'Cleveland Guardians',     position: 'LF',  sport: 'Baseball', cardType: 'Net to Net' },

  // ── Minnesota Twins ───────────────────────────────────────────────────────
  { name: 'Carlos Correa',         team: 'Minnesota Twins',         position: 'SS',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Byron Buxton',          team: 'Minnesota Twins',         position: 'CF',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Pablo Lopez',           team: 'Minnesota Twins',         position: 'SP',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Joe Ryan',              team: 'Minnesota Twins',         position: 'SP',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Ryan Jeffers',          team: 'Minnesota Twins',         position: 'C',   sport: 'Baseball', cardType: 'Parallel' },

  // ── Chicago White Sox ─────────────────────────────────────────────────────
  { name: 'Luis Robert Jr.',       team: 'Chicago White Sox',       position: 'CF',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Yoan Moncada',          team: 'Chicago White Sox',       position: '3B',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Andrew Vaughn',         team: 'Chicago White Sox',       position: '1B',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Michael Kopech',        team: 'Chicago White Sox',       position: 'SP',  sport: 'Baseball', cardType: 'Parallel' },
  { name: 'Nicky Lopez',           team: 'Chicago White Sox',       position: 'SS',  sport: 'Baseball', cardType: 'Base' },

  // ── Kansas City Royals ────────────────────────────────────────────────────
  { name: 'Bobby Witt Jr.',        team: 'Kansas City Royals',      position: 'SS',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Salvador Perez',        team: 'Kansas City Royals',      position: 'C',   sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Cole Ragans',           team: 'Kansas City Royals',      position: 'SP',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Vinnie Pasquantino',    team: 'Kansas City Royals',      position: '1B',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Seth Lugo',             team: 'Kansas City Royals',      position: 'SP',  sport: 'Baseball', cardType: 'Net to Net' },

  // ── Detroit Tigers ────────────────────────────────────────────────────────
  { name: 'Tarik Skubal',          team: 'Detroit Tigers',          position: 'SP',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Riley Greene',          team: 'Detroit Tigers',          position: 'LF',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Spencer Torkelson',     team: 'Detroit Tigers',          position: '1B',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Kerry Carpenter',       team: 'Detroit Tigers',          position: 'RF',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Parker Meadows',        team: 'Detroit Tigers',          position: 'CF',  sport: 'Baseball', cardType: 'Parallel' },

  // ── Houston Astros ────────────────────────────────────────────────────────
  { name: 'Yordan Alvarez',        team: 'Houston Astros',          position: 'DH',  sport: 'Baseball', cardType: 'Patch Jersey' },
  { name: 'Jose Altuve',           team: 'Houston Astros',          position: '2B',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Framber Valdez',        team: 'Houston Astros',          position: 'SP',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Jeremy Pena',           team: 'Houston Astros',          position: 'SS',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Yainer Diaz',           team: 'Houston Astros',          position: 'C',   sport: 'Baseball', cardType: 'Parallel' },

  // ── Los Angeles Angels ────────────────────────────────────────────────────
  { name: 'Mike Trout',            team: 'Los Angeles Angels',      position: 'CF',  sport: 'Baseball', cardType: 'Patch Jersey' },
  { name: 'Zach Neto',             team: 'Los Angeles Angels',      position: 'SS',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Logan O\'Hoppe',        team: 'Los Angeles Angels',      position: 'C',   sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Jo Adell',              team: 'Los Angeles Angels',      position: 'RF',  sport: 'Baseball', cardType: 'Parallel' },
  { name: 'Tyler Anderson',        team: 'Los Angeles Angels',      position: 'SP',  sport: 'Baseball', cardType: 'Parallel' },

  // ── Athletics ─────────────────────────────────────────────────────────────
  { name: 'Brent Rooker',          team: 'Athletics',               position: 'DH',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Mason Miller',          team: 'Athletics',               position: 'RP',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Shea Langeliers',       team: 'Athletics',               position: 'C',   sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Zack Gelof',            team: 'Athletics',               position: '2B',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'JJ Bleday',             team: 'Athletics',               position: 'LF',  sport: 'Baseball', cardType: 'Parallel' },

  // ── Seattle Mariners ──────────────────────────────────────────────────────
  { name: 'Julio Rodriguez',       team: 'Seattle Mariners',        position: 'CF',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Randy Arozarena',       team: 'Seattle Mariners',        position: 'LF',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Cal Raleigh',           team: 'Seattle Mariners',        position: 'C',   sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Logan Gilbert',         team: 'Seattle Mariners',        position: 'SP',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'George Kirby',          team: 'Seattle Mariners',        position: 'SP',  sport: 'Baseball', cardType: 'Downtown' },

  // ── Texas Rangers ─────────────────────────────────────────────────────────
  { name: 'Corey Seager',          team: 'Texas Rangers',           position: 'SS',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Marcus Semien',         team: 'Texas Rangers',           position: '2B',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Adolis Garcia',         team: 'Texas Rangers',           position: 'RF',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Nathaniel Lowe',        team: 'Texas Rangers',           position: '1B',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Jon Gray',              team: 'Texas Rangers',           position: 'SP',  sport: 'Baseball', cardType: 'Parallel' },

  // ── Atlanta Braves ────────────────────────────────────────────────────────
  { name: 'Ronald Acuna Jr.',      team: 'Atlanta Braves',          position: 'RF',  sport: 'Baseball', cardType: 'Patch Jersey' },
  { name: 'Spencer Strider',       team: 'Atlanta Braves',          position: 'SP',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Matt Olson',            team: 'Atlanta Braves',          position: '1B',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Austin Riley',          team: 'Atlanta Braves',          position: '3B',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Ozzie Albies',          team: 'Atlanta Braves',          position: '2B',  sport: 'Baseball', cardType: 'Net to Net' },

  // ── Miami Marlins ─────────────────────────────────────────────────────────
  { name: 'Sandy Alcantara',       team: 'Miami Marlins',           position: 'SP',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Jesus Luzardo',         team: 'Miami Marlins',           position: 'SP',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Jake Burger',           team: 'Miami Marlins',           position: '3B',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Eury Perez',            team: 'Miami Marlins',           position: 'SP',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Jorge Soler',           team: 'Miami Marlins',           position: 'DH',  sport: 'Baseball', cardType: 'Parallel' },

  // ── New York Mets ─────────────────────────────────────────────────────────
  { name: 'Francisco Lindor',      team: 'New York Mets',           position: 'SS',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Pete Alonso',           team: 'New York Mets',           position: '1B',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Kodai Senga',           team: 'New York Mets',           position: 'SP',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Sean Manaea',           team: 'New York Mets',           position: 'SP',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Brandon Nimmo',         team: 'New York Mets',           position: 'CF',  sport: 'Baseball', cardType: 'Net to Net' },

  // ── Philadelphia Phillies ─────────────────────────────────────────────────
  { name: 'Bryce Harper',          team: 'Philadelphia Phillies',   position: '1B',  sport: 'Baseball', cardType: 'Patch Jersey' },
  { name: 'Trea Turner',           team: 'Philadelphia Phillies',   position: 'SS',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Zack Wheeler',          team: 'Philadelphia Phillies',   position: 'SP',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Kyle Schwarber',        team: 'Philadelphia Phillies',   position: 'LF',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Aaron Nola',            team: 'Philadelphia Phillies',   position: 'SP',  sport: 'Baseball', cardType: 'Downtown' },

  // ── Washington Nationals ──────────────────────────────────────────────────
  { name: 'CJ Abrams',             team: 'Washington Nationals',    position: 'SS',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'MacKenzie Gore',        team: 'Washington Nationals',    position: 'SP',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Keibert Ruiz',          team: 'Washington Nationals',    position: 'C',   sport: 'Baseball', cardType: 'Parallel' },
  { name: 'Josiah Gray',           team: 'Washington Nationals',    position: 'SP',  sport: 'Baseball', cardType: 'Parallel' },
  { name: 'Victor Robles',         team: 'Washington Nationals',    position: 'CF',  sport: 'Baseball', cardType: 'Base' },

  // ── Chicago Cubs ──────────────────────────────────────────────────────────
  { name: 'Kyle Tucker',           team: 'Chicago Cubs',            position: 'RF',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Dansby Swanson',        team: 'Chicago Cubs',            position: 'SS',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Seiya Suzuki',          team: 'Chicago Cubs',            position: 'RF',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Justin Steele',         team: 'Chicago Cubs',            position: 'SP',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Ian Happ',              team: 'Chicago Cubs',            position: 'LF',  sport: 'Baseball', cardType: 'Net to Net' },

  // ── Cincinnati Reds ───────────────────────────────────────────────────────
  { name: 'Elly De La Cruz',       team: 'Cincinnati Reds',         position: 'SS',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Hunter Greene',         team: 'Cincinnati Reds',         position: 'SP',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Jonathan India',        team: 'Cincinnati Reds',         position: '2B',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Nick Lodolo',           team: 'Cincinnati Reds',         position: 'SP',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Matt McLain',           team: 'Cincinnati Reds',         position: '2B',  sport: 'Baseball', cardType: 'Parallel' },

  // ── Milwaukee Brewers ─────────────────────────────────────────────────────
  { name: 'Christian Yelich',      team: 'Milwaukee Brewers',       position: 'LF',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Jackson Chourio',       team: 'Milwaukee Brewers',       position: 'LF',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Freddy Peralta',        team: 'Milwaukee Brewers',       position: 'SP',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'William Contreras',     team: 'Milwaukee Brewers',       position: 'C',   sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Sal Frelick',           team: 'Milwaukee Brewers',       position: 'CF',  sport: 'Baseball', cardType: 'Parallel' },

  // ── Pittsburgh Pirates ────────────────────────────────────────────────────
  { name: 'Paul Skenes',           team: 'Pittsburgh Pirates',      position: 'SP',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Oneil Cruz',            team: 'Pittsburgh Pirates',      position: 'SS',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Ke\'Bryan Hayes',       team: 'Pittsburgh Pirates',      position: '3B',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Mitch Keller',          team: 'Pittsburgh Pirates',      position: 'SP',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Bryan Reynolds',        team: 'Pittsburgh Pirates',      position: 'CF',  sport: 'Baseball', cardType: 'Net to Net' },

  // ── St. Louis Cardinals ───────────────────────────────────────────────────
  { name: 'Nolan Arenado',         team: 'St. Louis Cardinals',     position: '3B',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Nolan Gorman',          team: 'St. Louis Cardinals',     position: '2B',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Willson Contreras',     team: 'St. Louis Cardinals',     position: 'C',   sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Miles Mikolas',         team: 'St. Louis Cardinals',     position: 'SP',  sport: 'Baseball', cardType: 'Parallel' },
  { name: 'Lars Nootbaar',         team: 'St. Louis Cardinals',     position: 'RF',  sport: 'Baseball', cardType: 'Parallel' },

  // ── Arizona Diamondbacks ──────────────────────────────────────────────────
  { name: 'Ketel Marte',           team: 'Arizona Diamondbacks',    position: '2B',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Corbin Carroll',        team: 'Arizona Diamondbacks',    position: 'CF',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Zac Gallen',            team: 'Arizona Diamondbacks',    position: 'SP',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Gabriel Moreno',        team: 'Arizona Diamondbacks',    position: 'C',   sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Lourdes Gurriel Jr.',   team: 'Arizona Diamondbacks',    position: 'LF',  sport: 'Baseball', cardType: 'Net to Net' },

  // ── Colorado Rockies ──────────────────────────────────────────────────────
  { name: 'Ryan McMahon',          team: 'Colorado Rockies',        position: '3B',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Ezequiel Tovar',        team: 'Colorado Rockies',        position: 'SS',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Brenton Doyle',         team: 'Colorado Rockies',        position: 'CF',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Kyle Freeland',         team: 'Colorado Rockies',        position: 'SP',  sport: 'Baseball', cardType: 'Parallel' },
  { name: 'Elias Diaz',            team: 'Colorado Rockies',        position: 'C',   sport: 'Baseball', cardType: 'Parallel' },

  // ── Los Angeles Dodgers ───────────────────────────────────────────────────
  { name: 'Shohei Ohtani',         team: 'Los Angeles Dodgers',     position: 'DH',  sport: 'Baseball', cardType: 'Patch Jersey' },
  { name: 'Mookie Betts',          team: 'Los Angeles Dodgers',     position: 'RF',  sport: 'Baseball', cardType: 'Patch Jersey' },
  { name: 'Freddie Freeman',       team: 'Los Angeles Dodgers',     position: '1B',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Yoshinobu Yamamoto',    team: 'Los Angeles Dodgers',     position: 'SP',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Tyler Glasnow',         team: 'Los Angeles Dodgers',     position: 'SP',  sport: 'Baseball', cardType: 'Downtown' },

  // ── San Diego Padres ──────────────────────────────────────────────────────
  { name: 'Fernando Tatis Jr.',    team: 'San Diego Padres',        position: 'RF',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Manny Machado',         team: 'San Diego Padres',        position: '3B',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Dylan Cease',           team: 'San Diego Padres',        position: 'SP',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Luis Arraez',           team: 'San Diego Padres',        position: '2B',  sport: 'Baseball', cardType: 'Downtown' },
  { name: 'Xander Bogaerts',       team: 'San Diego Padres',        position: 'SS',  sport: 'Baseball', cardType: 'Net to Net' },

  // ── San Francisco Giants ──────────────────────────────────────────────────
  { name: 'Logan Webb',            team: 'San Francisco Giants',    position: 'SP',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Willy Adames',          team: 'San Francisco Giants',    position: 'SS',  sport: 'Baseball', cardType: 'Kaboom' },
  { name: 'Patrick Bailey',        team: 'San Francisco Giants',    position: 'C',   sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'Jung Hoo Lee',          team: 'San Francisco Giants',    position: 'CF',  sport: 'Baseball', cardType: 'Net to Net' },
  { name: 'LaMonte Wade Jr.',      team: 'San Francisco Giants',    position: '1B',  sport: 'Baseball', cardType: 'Parallel' },
]

export default mlbPlayers
