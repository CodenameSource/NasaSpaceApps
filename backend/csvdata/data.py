import django
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

import pandas as pd
from csvdata.serializers import SeismicEventSerializer

FILENAME = './data/gagnepian_2006_catalog.csv'


def collect_data(filename):
    df = pd.read_csv(filename)

    seismic_json = []

    for entry in df.iterrows():
        temp_dict = {
            'type': entry[1]['Type'],
            'lat': entry[1]['Lat'],
            'long': entry[1]['Long'],
            'depth': entry[1]['Depth'],
            'date': pd.to_datetime('19' + str(entry[1]['Date']), format='%Y%m%d%H%M%S')
        }
        seismic_json.append(temp_dict)

    for entry in seismic_json:
        serializer = SeismicEventSerializer(data=entry)
        if serializer.is_valid():
            serializer.save()

    return seismic_json

collect_data(FILENAME)