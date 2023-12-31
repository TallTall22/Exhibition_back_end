'use strict'

async function fetchData(url) {
  const response = await fetch(
    url, {
    ...allowLegacyRenegotiationforNodeJsOptions,
    headers: {
      apiKey: NP_MUSEUM_API_KEY,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  });
  const collection = await response.json();
  return collection;
}

function axiosData(url) {
  return axios({
    ...allowLegacyRenegotiationforNodeJsOptions,
    url,
    headers: {
      apiKey: NP_MUSEUM_API_KEY,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });
}
const crypto = require('crypto')
const https = require('https')
const axios = require('axios')


const NP_MUSEUM_API_KEY = process.env.NP_MUSEUM_API_KEY

const allowLegacyRenegotiationforNodeJsOptions = {
  httpsAgent: new https.Agent({
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
  })
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const exhibitions=await queryInterface.sequelize.query('SELECT id FROM Exhibitions',{where:{name:'未出展'}})
    const urls = [
      'https://openapi.npm.gov.tw/v1/rest/collection/search?limit=50&offset=0&lang=cht',
      'https://openapi.npm.gov.tw/v1/rest/collection/search?limit=50&offset=50&lang=cht',
      'https://openapi.npm.gov.tw/v1/rest/collection/search?limit=50&offset=100&lang=cht',
      'https://openapi.npm.gov.tw/v1/rest/collection/search?limit=50&offset=150&lang=cht',
      'https://openapi.npm.gov.tw/v1/rest/collection/search?limit=50&offset=200&lang=cht',
      'https://openapi.npm.gov.tw/v1/rest/collection/search?limit=50&offset=250&lang=cht'
    ]

    const data = []
    const response1 = await axiosData(urls[0])
    const response2 = await axiosData(urls[1])
    const response3 = await axiosData(urls[2])
    const response4 = await axiosData(urls[3])
    const response5 = await axiosData(urls[4])
    const response6 = await axiosData(urls[5])

    const data1 = await response1.data.result
    const data2 = await response2.data.result
    const data3 = await response3.data.result
    const data4 = await response4.data.result
    const data5 = await response5.data.result
    const data6 = await response6.data.result
    data.push(...data1, ...data2, ...data3, ...data4,...data5,...data6)

    await Promise.all(data.map(async d => {
      const collection = await fetchData(`https://openapi.npm.gov.tw/v1/rest/collection/search/${d["Serial_No"]}`)
      const categories = await queryInterface.sequelize.query(
      'SELECT id FROM Categories WHERE name = :name;',
        {
          replacements: { name: collection.result[0].CateGory },
          type: queryInterface.sequelize.QueryTypes.SELECT
        }
      );
      const collections = []
      collections.push({
        name: collection.result[0].ArticleSubject,
        category: collection.result[0].CateGory,
        slogan: collection.result[0].Slogan,
        art_maker: collection.result[0].ArticleMaker,
        description: collection.result[0].ArticleContext,
        art_remark: collection.result[0].ArticleRemarks,
        image: collection.result[0].imgUrl,
        exhibition_id:exhibitions[0][0].id,
        category_id:categories[0].id,
        created_at: new Date(),
        updated_at: new Date()
      })
      await queryInterface.bulkInsert('Collections', collections,{})
    }))

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Collections', {})
  }
}
