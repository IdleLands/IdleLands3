
import _ from 'lodash';
import { Map } from './map';
import fs from 'fs';

export class World {
  constructor() {
    this.maps = {};
    this.uniqueRegions = [];

    this.loadAllMaps();
  }

  getMapsInFolder(dir) {
    let results = [];

    const list = fs.readdirSync(dir);
    _.each(list, basefilename => {
      const filename = `${dir}/${basefilename}`;
      const stat = fs.statSync(filename);
      if(stat && stat.isDirectory()) results = results.concat(this.getMapsInFolder(filename));
      else results.push({ map: basefilename.split('.')[0], path: filename });
    });

    return results;
  }

  loadAllMaps() {
    _.each(this.getMapsInFolder('assets/maps/world-maps'), ({ map, path }) => {
      const mapRef = new Map(path);
      this.maps[map] = mapRef;

      this.uniqueRegions.push(..._.uniq(_.compact(mapRef.regions)));
    });
  }
}