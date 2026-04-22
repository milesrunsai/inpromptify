// Simple check for existing data
const https = require('https');

const checkData = () => {
  const url = 'https://inpromptify.com/api/leaderboard?tab=alltime';
  
  https.get(url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log('📊 Leaderboard Data Check:');
        console.log(`- Total entries: ${result.entries?.length || 0}`);
        console.log(`- Total players: ${result.stats?.totalPlayers || 0}`);
        
        if (result.entries && result.entries.length > 0) {
          console.log('\n🏆 Top 3 scores:');
          result.entries.slice(0, 3).forEach((entry, i) => {
            console.log(`  ${i + 1}. ${entry.name}: ${entry.score}/100`);
          });
        } else {
          console.log('\n❌ No assessment data found yet');
        }
        
      } catch (e) {
        console.log('❌ Error parsing response:', e.message);
        console.log('Raw response:', data.slice(0, 200));
      }
    });
  }).on('error', (err) => {
    console.log('❌ Request failed:', err.message);
  });
};

checkData();