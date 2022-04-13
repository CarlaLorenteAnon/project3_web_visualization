from flask import Flask, jsonify
from sqlalchemy import create_engine
import os
import numpy as np
import json
import pandas as pd
from decimal import Decimal
from flask_cors import CORS 



# Connect to POSTGRES
##################################

rds_connection_string = "postgresql://vzgrmmdttkwsnk:5b0f5e6c07de8fc1c547861230ed3726ec9a09021f0e40db1cd92c4a119d1bce@ec2-52-86-56-90.compute-1.amazonaws.com:5432/df4j8v6ob22efh"
engine = create_engine(rds_connection_string)
#conn = engine.connect()



# Flask Setup
##################################

app = Flask(__name__)



# Flask Routes
###################################

@app.route("/")
@cross_origin()
def welcome():
    '''List Available API Routes'''
    return(
        f'<h2>Available Routes: </h2><br>'
        f'<h3>/api/v1.0/zip-populations</h3>'
        f'<h3>/api/v1.0/populations-latlongs</h3>'

        f'<h3>/api/v1.0/petfriendly-rankings</h3>'
        f'<h3>/api/v1.0/happiest-cities</h3>'
        f'<h3>/api/v1.0/income-and-population</h3>'
        f'<h3>/api/v1.0/number-disasters-by-state</h3>'
        f'<h3>/api/v1.0/IntergenerationalMobility</h3>'

    )


@app.route("/api/v1.0/zip-populations")
@cross_origin()
def zip_pops():
    # Create our session (link) from Python to the DB


    data = engine.execute("SELECT us_zip_code, estimated_population FROM zips")
    result = json.dumps([dict(r) for r in data])
    return result

@app.route("/api/v1.0/populations-latlongs")
@cross_origin()

def poplocs():
    
    data = engine.execute("SELECT latitude, longitude, estimated_population FROM zips")
    result = json.dumps([dict(r) for r in data])
    return result


@app.route("/api/v1.0/petfriendly-rankings")
@cross_origin()
def pets():
    data = engine.execute('SELECT mastercity.primary_city, mastercity.latitude, mastercity.longitude, dogfriendly.overall_rank FROM mastercity INNER JOIN dogfriendly ON mastercity.primary_city=dogfriendly.city ORDER BY dogfriendly.overall_rank ASC')
    '''data2 = pd.DataFrame(data)
    data3 = data2.rename(columns={0: 'primary_city', 1: 'latitude', 2: 'longitude', 3: 'overall_score'})
    data3["latitude"] = data3["latitude"].astype(float)
    data3["longitude"] = data3["longitude"].astype(float)
    data4 = Convert2GeoJson(
          data3,
          data3.columns,
          lat= 'latitude',
          lon= 'longitude')
    data5 = data4.geojson()'''

    result = json.dumps([dict(r) for r in data])
    return result

@app.route("/api/v1.0/happiest-cities")
@cross_origin()
def happy():
  data = engine.execute('SELECT mastercity.primary_city, happiestcities.overall_rank, happiestcities.emotional_physical, happiestcities.income_employment, happiestcities.community_environment, mastercity.latitude, mastercity.longitude FROM mastercity INNER JOIN happiestcities ON mastercity.primary_city=happiestcities.city;')
  result =json.dumps([dict(r) for r in data])
  return result

@app.route('/api/v1.0/income-and-population')
@cross_origin()
def income():
  data = engine.execute('''SELECT zips.primary_city, income_and_population.zipcode, income_and_population.avg_income, income_and_population.total_pop
    FROM zips
    INNER JOIN income_and_population ON zips.us_zip_code=income_and_population.zipcode
    GROUP BY zips.primary_city, income_and_population.zipcode, income_and_population.avg_income, income_and_population.total_pop;''')
  result = json.dumps([dict(r) for r in data])
  return result

@app.route('/api/v1.0/number-disasters-by-state')
@cross_origin()
def disasters():
  data = engine.execute('''SELECT state, count(fy_declared) as disasters
      FROM naturaldisasters
      GROUP BY naturaldisasters.state;''')
  result = json.dumps([dict(r) for r in data])
  return result

# New App Route Placeholder for Intergenerational Mobility
@app.route('/api/v1.0/IntergenerationalMobility')
@cross_origin()
def IntergenerationalMobility():
  data = engine.execute('''SELECT cbsa.ZipCode,im.AbsoluteUpwardMobility,zips.Latitude,zips.Longitude
      FROM IntergenerationalMobility im 
      JOIN ZipCode_CBSA_Mapping cbsa ON im.CBSA=cbsa.CBSA
      JOIN Zips zips ON cbsa.ZipCode=zips.US_Zip_Code
      WHERE cbsa.ZipCode IN (SELECT ZipCode FROM ZipCodeCounts
      WHERE RecordCount =1)
      UNION ALL
      SELECT cbsa.ZipCode,MAX(im.AbsoluteUpwardMobility) AS AbsoluteUpwardMobility,zips.Latitude,zips.Longitude
      FROM IntergenerationalMobility im 
      JOIN ZipCode_CBSA_Mapping cbsa ON im.CBSA=cbsa.CBSA
      JOIN Zips zips ON cbsa.ZipCode=zips.US_Zip_Code
      WHERE cbsa.ZipCode IN (SELECT ZipCode FROM ZipCodeCounts
      WHERE RecordCount >1)
      GROUP BY cbsa.ZipCode,zips.Latitude,zips.Longitude;''')
  result = json.dumps([dict(r) for r in data])
  return result

if __name__ == '__main__':
    app.run(debug=True)
