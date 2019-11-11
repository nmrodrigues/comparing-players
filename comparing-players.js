const axios = require('axios');


let luka; // declares luka
let lukaStats = []; // holds Luka's paginated data
let lukaPoints = 0;
let dirk; // declares dirk
let dirkStats = []; // holds Dirk's paginated data
let dirkPoints = 0;
let pageNumber;



// retrieves the data from NBA database
const getLuka = () => {
  return axios.get('https://balldontlie.io/api/v1/players?search=doncic');
  };

  const getLukaStats = (pageNumber) => {
    return axios.get(`https://balldontlie.io/api/v1/stats?seasons[]=2018&player_ids[]=132&page=${pageNumber}`) // puts the data into the variable directly
  }

// retrieves Dirk's data from NBA database
const getDirk = () =>{
  return axios.get('https://balldontlie.io/api/v1/players?search=nowitzki');
};


  const getDirkStats = (pageNumber) => {
    return axios.get(`https://balldontlie.io/api/v1/stats?seasons[]=1998&player_ids[]=346&page=${pageNumber}`) // puts the data into the variable directly
  }


// event driven instead of synchronized driven
const compare = async () => {
  await getLuka().then(resp => {
    luka = resp.data.data[0];
  })

  // waits for Dirk's data and then extract the desired data
  await getDirk().then(resp => {
    dirk = resp.data.data[0];
  })

 // console.log(luka);
 // console.log(dirk);

  await getLukaStats(pageNumber).then(async resp => {
    const pages = resp.data.meta.total_pages;
    let currentPage = resp.data.meta.current_page;
    while (currentPage <= pages){
      await getLukaStats(currentPage).then( resp => {
        lukaStats = lukaStats.concat(resp.data.data);
        currentPage += 1;
      })
    }
  });


await getDirkStats(pageNumber).then(async resp => {
    const pages = resp.data.meta.total_pages;
    let currentPage = resp.data.meta.current_page;
    while (currentPage <= pages){
      await getDirkStats(currentPage).then( resp => {
        dirkStats = dirkStats.concat(resp.data.data);
        currentPage += 1;
      })
    }
  });

  lukaStats.forEach(item => {
    if(item.pts != null){
      lukaPoints += parseInt(item.pts)
    }
  })

  dirkStats.forEach(item => {
    if(item.pts != null){
      dirkPoints += parseInt(item.pts)
    }
  })

  // print which player played better
  if(lukaPoints > dirkPoints){
    console.log('Luka performed better.');
  }else{
    console.log('Dirk performed better.');
  }

  console.log('Dirk\'s Points: ', dirkPoints,'Luca\'s Points: ', lukaPoints);
}



compare();