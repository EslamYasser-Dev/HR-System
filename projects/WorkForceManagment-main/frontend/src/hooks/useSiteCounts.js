import { useEffect, useState } from 'react';

const useSiteCounts = (data) => {
  const [siteCounts, setSiteCounts] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const result = data.reduce((acc, item) => {
        const site = item.site;
        const existingItemIndex = acc.findIndex(obj => obj.site === site);

        if (existingItemIndex === -1) {
          acc.push({ site, count: 1 });
        } else {
          acc[existingItemIndex].count++;
        }

        return acc;
      }, []);

      setSiteCounts(result);
    }
  }, [data]);

  return siteCounts;
};

export default useSiteCounts;
