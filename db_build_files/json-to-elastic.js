const fs = require('fs')
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })


const readFile = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (data) {
        let jsonData = JSON.parse(data)
        resolve(jsonData)
      } else {
        reject()
      }
    })
  })
}

const createIndex = async (indexName) => {
  let { body } = await client.indices.exists({ index: indexName })

  if (body) {
   let res = await client.indices.delete({ index: indexName })
   console.log('[ ELASTICSEARCH ] - Previous index found. Deleted acknowledged:', res.body.acknowledged)
  }
  
  let res = await client.indices.create({
    index: indexName
  })

  console.log('[ ELASTICSEARCH ] - Index created. Create acknowledged:', res.body.acknowledged)
  return res.body.acknowledged 
}


const insertDocs = (docs, indexName) => {
  //array.push({ index:  { _index: elastic.indexName, _type: 'document', _id: id } })
  let bulkArr = []

  docs.forEach(doc => {
    bulkArr.push({ index:  { _index: 'wrecks'} })
    bulkArr.push(doc) 
  })

  client.bulk({
    body: bulkArr
  }).catch(err => console.log(err));
}


const search = (text) => {
  client.search({
    index: 'wrecks',
    q: text
  }).then(function(resp) {
      console.log('HITS:', resp.body.hits.total);
      console.log(resp.body.hits.hits)
  }, function(err) {
      console.trace(err.message);
  });
}


client.ping( async (error) => {
  if (error) {
    console.error('[ ELASTICSEARCH ] - No response!', error);
    process.exit()
  } else {
    console.log('[ ELASTICSEARCH ] - Client OK');
   
    // let res = await client.indices.stats({ index: 'wrecks' })
    // console.log(res.body.indices.wrecks)

    // let docs = await readFile('awois_wrecks.json')
    // console.log(docs.length)
    //  console.log(docs[9])
    //  await createIndex('wrecks')
    //  insertDocs(docs, 'wrecks')
    search('war gold')
     
  }
})

