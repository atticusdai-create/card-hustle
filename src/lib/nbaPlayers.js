const nbaPlayers = [
  // ── Atlanta Hawks ─────────────────────────────────────────────────────────
  { name: 'Trae Young',            team: 'Atlanta Hawks',           position: 'PG', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Dejounte Murray',       team: 'Atlanta Hawks',           position: 'SG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Jalen Johnson',         team: 'Atlanta Hawks',           position: 'SF', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Clint Capela',          team: 'Atlanta Hawks',           position: 'C',  sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Bogdan Bogdanovic',     team: 'Atlanta Hawks',           position: 'SG', sport: 'Basketball', cardType: 'Parallel' },

  // ── Boston Celtics ────────────────────────────────────────────────────────
  { name: 'Jayson Tatum',          team: 'Boston Celtics',          position: 'SF', sport: 'Basketball', cardType: 'Kaboom' },
  { name: 'Jaylen Brown',          team: 'Boston Celtics',          position: 'SG', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Kristaps Porzingis',    team: 'Boston Celtics',          position: 'C',  sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Jrue Holiday',          team: 'Boston Celtics',          position: 'PG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Al Horford',            team: 'Boston Celtics',          position: 'C',  sport: 'Basketball', cardType: 'Parallel' },

  // ── Brooklyn Nets ─────────────────────────────────────────────────────────
  { name: 'Cam Thomas',            team: 'Brooklyn Nets',           position: 'SG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Nic Claxton',           team: 'Brooklyn Nets',           position: 'C',  sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Ben Simmons',           team: 'Brooklyn Nets',           position: 'PG', sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Dorian Finney-Smith',   team: 'Brooklyn Nets',           position: 'SF', sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Dennis Schroder',       team: 'Brooklyn Nets',           position: 'PG', sport: 'Basketball', cardType: 'Base' },

  // ── Charlotte Hornets ─────────────────────────────────────────────────────
  { name: 'LaMelo Ball',           team: 'Charlotte Hornets',       position: 'PG', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Brandon Miller',        team: 'Charlotte Hornets',       position: 'SF', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Miles Bridges',         team: 'Charlotte Hornets',       position: 'SF', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Mark Williams',         team: 'Charlotte Hornets',       position: 'C',  sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Tre Mann',              team: 'Charlotte Hornets',       position: 'SG', sport: 'Basketball', cardType: 'Parallel' },

  // ── Chicago Bulls ─────────────────────────────────────────────────────────
  { name: 'Zach LaVine',           team: 'Chicago Bulls',           position: 'SG', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Nikola Vucevic',        team: 'Chicago Bulls',           position: 'C',  sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Coby White',            team: 'Chicago Bulls',           position: 'PG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Patrick Williams',      team: 'Chicago Bulls',           position: 'SF', sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Ayo Dosunmu',           team: 'Chicago Bulls',           position: 'SG', sport: 'Basketball', cardType: 'Parallel' },

  // ── Cleveland Cavaliers ───────────────────────────────────────────────────
  { name: 'Donovan Mitchell',      team: 'Cleveland Cavaliers',     position: 'SG', sport: 'Basketball', cardType: 'Kaboom' },
  { name: 'Darius Garland',        team: 'Cleveland Cavaliers',     position: 'PG', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Evan Mobley',           team: 'Cleveland Cavaliers',     position: 'PF', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Jarrett Allen',         team: 'Cleveland Cavaliers',     position: 'C',  sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Max Strus',             team: 'Cleveland Cavaliers',     position: 'SF', sport: 'Basketball', cardType: 'Parallel' },

  // ── Dallas Mavericks ──────────────────────────────────────────────────────
  { name: 'Luka Doncic',           team: 'Dallas Mavericks',        position: 'PG', sport: 'Basketball', cardType: 'Kaboom' },
  { name: 'Kyrie Irving',          team: 'Dallas Mavericks',        position: 'PG', sport: 'Basketball', cardType: 'Kaboom' },
  { name: 'P.J. Washington',       team: 'Dallas Mavericks',        position: 'PF', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Daniel Gafford',        team: 'Dallas Mavericks',        position: 'C',  sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Derrick Jones Jr.',     team: 'Dallas Mavericks',        position: 'SF', sport: 'Basketball', cardType: 'Parallel' },

  // ── Denver Nuggets ────────────────────────────────────────────────────────
  { name: 'Nikola Jokic',          team: 'Denver Nuggets',          position: 'C',  sport: 'Basketball', cardType: 'Kaboom' },
  { name: 'Jamal Murray',          team: 'Denver Nuggets',          position: 'PG', sport: 'Basketball', cardType: 'Kaboom' },
  { name: 'Michael Porter Jr.',    team: 'Denver Nuggets',          position: 'SF', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Aaron Gordon',          team: 'Denver Nuggets',          position: 'PF', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Kentavious Caldwell-Pope', team: 'Denver Nuggets',       position: 'SG', sport: 'Basketball', cardType: 'Parallel' },

  // ── Detroit Pistons ───────────────────────────────────────────────────────
  { name: 'Cade Cunningham',       team: 'Detroit Pistons',         position: 'PG', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Jalen Duren',           team: 'Detroit Pistons',         position: 'C',  sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Ausar Thompson',        team: 'Detroit Pistons',         position: 'SF', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Isaiah Stewart',        team: 'Detroit Pistons',         position: 'PF', sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Malik Beasley',         team: 'Detroit Pistons',         position: 'SG', sport: 'Basketball', cardType: 'Base' },

  // ── Golden State Warriors ─────────────────────────────────────────────────
  { name: 'Stephen Curry',         team: 'Golden State Warriors',   position: 'PG', sport: 'Basketball', cardType: 'Kaboom' },
  { name: 'Draymond Green',        team: 'Golden State Warriors',   position: 'PF', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Andrew Wiggins',        team: 'Golden State Warriors',   position: 'SF', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Jonathan Kuminga',      team: 'Golden State Warriors',   position: 'SF', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Brandin Podziemski',    team: 'Golden State Warriors',   position: 'SG', sport: 'Basketball', cardType: 'Parallel' },

  // ── Houston Rockets ───────────────────────────────────────────────────────
  { name: 'Alperen Sengun',        team: 'Houston Rockets',         position: 'C',  sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Jalen Green',           team: 'Houston Rockets',         position: 'SG', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Fred VanVleet',         team: 'Houston Rockets',         position: 'PG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Amen Thompson',         team: 'Houston Rockets',         position: 'SF', sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Dillon Brooks',         team: 'Houston Rockets',         position: 'SF', sport: 'Basketball', cardType: 'Parallel' },

  // ── Indiana Pacers ────────────────────────────────────────────────────────
  { name: 'Tyrese Haliburton',     team: 'Indiana Pacers',          position: 'PG', sport: 'Basketball', cardType: 'Kaboom' },
  { name: 'Pascal Siakam',         team: 'Indiana Pacers',          position: 'PF', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Myles Turner',          team: 'Indiana Pacers',          position: 'C',  sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Bennedict Mathurin',    team: 'Indiana Pacers',          position: 'SF', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Andrew Nembhard',       team: 'Indiana Pacers',          position: 'PG', sport: 'Basketball', cardType: 'Parallel' },

  // ── Los Angeles Clippers ──────────────────────────────────────────────────
  { name: 'Kawhi Leonard',         team: 'Los Angeles Clippers',    position: 'SF', sport: 'Basketball', cardType: 'Kaboom' },
  { name: 'James Harden',          team: 'Los Angeles Clippers',    position: 'PG', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Norman Powell',         team: 'Los Angeles Clippers',    position: 'SG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Ivica Zubac',           team: 'Los Angeles Clippers',    position: 'C',  sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Terance Mann',          team: 'Los Angeles Clippers',    position: 'SF', sport: 'Basketball', cardType: 'Base' },

  // ── Los Angeles Lakers ────────────────────────────────────────────────────
  { name: 'LeBron James',          team: 'Los Angeles Lakers',      position: 'SF', sport: 'Basketball', cardType: 'Kaboom' },
  { name: 'Anthony Davis',         team: 'Los Angeles Lakers',      position: 'C',  sport: 'Basketball', cardType: 'Kaboom' },
  { name: 'Austin Reaves',         team: 'Los Angeles Lakers',      position: 'SG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: "D'Angelo Russell",      team: 'Los Angeles Lakers',      position: 'PG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Rui Hachimura',         team: 'Los Angeles Lakers',      position: 'PF', sport: 'Basketball', cardType: 'Parallel' },

  // ── Memphis Grizzlies ─────────────────────────────────────────────────────
  { name: 'Ja Morant',             team: 'Memphis Grizzlies',       position: 'PG', sport: 'Basketball', cardType: 'Kaboom' },
  { name: 'Jaren Jackson Jr.',     team: 'Memphis Grizzlies',       position: 'PF', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Desmond Bane',          team: 'Memphis Grizzlies',       position: 'SG', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Marcus Smart',          team: 'Memphis Grizzlies',       position: 'PG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Santi Aldama',          team: 'Memphis Grizzlies',       position: 'PF', sport: 'Basketball', cardType: 'Parallel' },

  // ── Miami Heat ────────────────────────────────────────────────────────────
  { name: 'Bam Adebayo',           team: 'Miami Heat',              position: 'C',  sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Tyler Herro',           team: 'Miami Heat',              position: 'SG', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Terry Rozier',          team: 'Miami Heat',              position: 'PG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Duncan Robinson',       team: 'Miami Heat',              position: 'SF', sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Nikola Jovic',          team: 'Miami Heat',              position: 'PF', sport: 'Basketball', cardType: 'Parallel' },

  // ── Milwaukee Bucks ───────────────────────────────────────────────────────
  { name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks',         position: 'PF', sport: 'Basketball', cardType: 'Kaboom' },
  { name: 'Damian Lillard',        team: 'Milwaukee Bucks',         position: 'PG', sport: 'Basketball', cardType: 'Kaboom' },
  { name: 'Khris Middleton',       team: 'Milwaukee Bucks',         position: 'SF', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Brook Lopez',           team: 'Milwaukee Bucks',         position: 'C',  sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Bobby Portis',          team: 'Milwaukee Bucks',         position: 'PF', sport: 'Basketball', cardType: 'Parallel' },

  // ── Minnesota Timberwolves ────────────────────────────────────────────────
  { name: 'Anthony Edwards',       team: 'Minnesota Timberwolves',  position: 'SG', sport: 'Basketball', cardType: 'Kaboom' },
  { name: 'Rudy Gobert',           team: 'Minnesota Timberwolves',  position: 'C',  sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Jaden McDaniels',       team: 'Minnesota Timberwolves',  position: 'SF', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Mike Conley',           team: 'Minnesota Timberwolves',  position: 'PG', sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Nickeil Alexander-Walker', team: 'Minnesota Timberwolves', position: 'SG', sport: 'Basketball', cardType: 'Base' },

  // ── New Orleans Pelicans ──────────────────────────────────────────────────
  { name: 'Zion Williamson',       team: 'New Orleans Pelicans',    position: 'PF', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Brandon Ingram',        team: 'New Orleans Pelicans',    position: 'SF', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'CJ McCollum',           team: 'New Orleans Pelicans',    position: 'SG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Trey Murphy III',       team: 'New Orleans Pelicans',    position: 'SF', sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Herbert Jones',         team: 'New Orleans Pelicans',    position: 'SF', sport: 'Basketball', cardType: 'Parallel' },

  // ── New York Knicks ───────────────────────────────────────────────────────
  { name: 'Jalen Brunson',         team: 'New York Knicks',         position: 'PG', sport: 'Basketball', cardType: 'Kaboom' },
  { name: 'Karl-Anthony Towns',    team: 'New York Knicks',         position: 'C',  sport: 'Basketball', cardType: 'Downtown' },
  { name: 'OG Anunoby',            team: 'New York Knicks',         position: 'SF', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Julius Randle',         team: 'New York Knicks',         position: 'PF', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Josh Hart',             team: 'New York Knicks',         position: 'SF', sport: 'Basketball', cardType: 'Parallel' },

  // ── Oklahoma City Thunder ─────────────────────────────────────────────────
  { name: 'Shai Gilgeous-Alexander', team: 'Oklahoma City Thunder', position: 'SG', sport: 'Basketball', cardType: 'Kaboom' },
  { name: 'Chet Holmgren',         team: 'Oklahoma City Thunder',   position: 'C',  sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Jalen Williams',        team: 'Oklahoma City Thunder',   position: 'SF', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Lu Dort',               team: 'Oklahoma City Thunder',   position: 'SG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Isaiah Hartenstein',    team: 'Oklahoma City Thunder',   position: 'C',  sport: 'Basketball', cardType: 'Net to Net' },

  // ── Orlando Magic ─────────────────────────────────────────────────────────
  { name: 'Paolo Banchero',        team: 'Orlando Magic',           position: 'PF', sport: 'Basketball', cardType: 'Kaboom' },
  { name: 'Franz Wagner',          team: 'Orlando Magic',           position: 'SF', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Wendell Carter Jr.',    team: 'Orlando Magic',           position: 'C',  sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Jalen Suggs',           team: 'Orlando Magic',           position: 'PG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Cole Anthony',          team: 'Orlando Magic',           position: 'PG', sport: 'Basketball', cardType: 'Parallel' },

  // ── Philadelphia 76ers ────────────────────────────────────────────────────
  { name: 'Joel Embiid',           team: 'Philadelphia 76ers',      position: 'C',  sport: 'Basketball', cardType: 'Kaboom' },
  { name: 'Tyrese Maxey',          team: 'Philadelphia 76ers',      position: 'PG', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Paul George',           team: 'Philadelphia 76ers',      position: 'SF', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Kelly Oubre Jr.',       team: 'Philadelphia 76ers',      position: 'SF', sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Andre Drummond',        team: 'Philadelphia 76ers',      position: 'C',  sport: 'Basketball', cardType: 'Base' },

  // ── Phoenix Suns ──────────────────────────────────────────────────────────
  { name: 'Kevin Durant',          team: 'Phoenix Suns',            position: 'SF', sport: 'Basketball', cardType: 'Kaboom' },
  { name: 'Devin Booker',          team: 'Phoenix Suns',            position: 'SG', sport: 'Basketball', cardType: 'Kaboom' },
  { name: 'Bradley Beal',          team: 'Phoenix Suns',            position: 'SG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Jusuf Nurkic',          team: 'Phoenix Suns',            position: 'C',  sport: 'Basketball', cardType: 'Parallel' },
  { name: "Royce O'Neale",         team: 'Phoenix Suns',            position: 'SF', sport: 'Basketball', cardType: 'Base' },

  // ── Portland Trail Blazers ────────────────────────────────────────────────
  { name: 'Anfernee Simons',       team: 'Portland Trail Blazers',  position: 'SG', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Scoot Henderson',       team: 'Portland Trail Blazers',  position: 'PG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Jerami Grant',          team: 'Portland Trail Blazers',  position: 'PF', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Shaedon Sharpe',        team: 'Portland Trail Blazers',  position: 'SG', sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Deandre Ayton',         team: 'Portland Trail Blazers',  position: 'C',  sport: 'Basketball', cardType: 'Parallel' },

  // ── Sacramento Kings ──────────────────────────────────────────────────────
  { name: "De'Aaron Fox",          team: 'Sacramento Kings',        position: 'PG', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Domantas Sabonis',      team: 'Sacramento Kings',        position: 'C',  sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Malik Monk',            team: 'Sacramento Kings',        position: 'SG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Harrison Barnes',       team: 'Sacramento Kings',        position: 'SF', sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Kevin Huerter',         team: 'Sacramento Kings',        position: 'SF', sport: 'Basketball', cardType: 'Parallel' },

  // ── San Antonio Spurs ─────────────────────────────────────────────────────
  { name: 'Victor Wembanyama',     team: 'San Antonio Spurs',       position: 'C',  sport: 'Basketball', cardType: 'Kaboom' },
  { name: 'Devin Vassell',         team: 'San Antonio Spurs',       position: 'SG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Jeremy Sochan',         team: 'San Antonio Spurs',       position: 'PF', sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Keldon Johnson',        team: 'San Antonio Spurs',       position: 'SF', sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Malaki Branham',        team: 'San Antonio Spurs',       position: 'SG', sport: 'Basketball', cardType: 'Base' },

  // ── Toronto Raptors ───────────────────────────────────────────────────────
  { name: 'Scottie Barnes',        team: 'Toronto Raptors',         position: 'PF', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'RJ Barrett',            team: 'Toronto Raptors',         position: 'SG', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Immanuel Quickley',     team: 'Toronto Raptors',         position: 'PG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Jakob Poeltl',          team: 'Toronto Raptors',         position: 'C',  sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Kelly Olynyk',          team: 'Toronto Raptors',         position: 'PF', sport: 'Basketball', cardType: 'Base' },

  // ── Utah Jazz ─────────────────────────────────────────────────────────────
  { name: 'Lauri Markkanen',       team: 'Utah Jazz',               position: 'PF', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Collin Sexton',         team: 'Utah Jazz',               position: 'PG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'John Collins',          team: 'Utah Jazz',               position: 'PF', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Jordan Clarkson',       team: 'Utah Jazz',               position: 'SG', sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Keyonte George',        team: 'Utah Jazz',               position: 'PG', sport: 'Basketball', cardType: 'Parallel' },

  // ── Washington Wizards ────────────────────────────────────────────────────
  { name: 'Jordan Poole',          team: 'Washington Wizards',      position: 'SG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Kyle Kuzma',            team: 'Washington Wizards',      position: 'SF', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Deni Avdija',           team: 'Washington Wizards',      position: 'SF', sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Bilal Coulibaly',       team: 'Washington Wizards',      position: 'SF', sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Marvin Bagley III',     team: 'Washington Wizards',      position: 'PF', sport: 'Basketball', cardType: 'Base' },

  // ── 2025 NBA Draft Rookies ────────────────────────────────────────────────
  { name: 'Cooper Flagg',          team: 'Dallas Mavericks',        position: 'SF', sport: 'Basketball', cardType: 'Signature' },
  { name: 'Dylan Harper',          team: 'San Antonio Spurs',       position: 'PG', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'Ace Bailey',            team: 'Washington Wizards',      position: 'SF', sport: 'Basketball', cardType: 'Downtown' },
  { name: 'VJ Edgecombe',          team: 'Charlotte Hornets',       position: 'SG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Tre Johnson',           team: 'Detroit Pistons',         position: 'SG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Kon Knueppel',          team: 'Brooklyn Nets',           position: 'SG', sport: 'Basketball', cardType: 'Net to Net' },
  { name: 'Noa Essengue',          team: 'Portland Trail Blazers',  position: 'PF', sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Kasparas Jakucionis',   team: 'Utah Jazz',               position: 'PG', sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Liam McNeeley',         team: 'New Orleans Pelicans',    position: 'SF', sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Jeremiah Fears',        team: 'Toronto Raptors',         position: 'PG', sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Khaman Maluach',        team: 'Houston Rockets',         position: 'C',  sport: 'Basketball', cardType: 'Parallel' },
  { name: 'Egor Demin',            team: 'Memphis Grizzlies',       position: 'PG', sport: 'Basketball', cardType: 'Base' },
  { name: 'Carter Bryant',         team: 'Golden State Warriors',   position: 'SF', sport: 'Basketball', cardType: 'Base' },
  { name: 'Eric Dixon',            team: 'Indiana Pacers',          position: 'PF', sport: 'Basketball', cardType: 'Base' },
  { name: 'Hugo Gonzalez',         team: 'Oklahoma City Thunder',   position: 'SG', sport: 'Basketball', cardType: 'Base' },
]

export default nbaPlayers
