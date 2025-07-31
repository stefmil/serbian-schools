// Static version of the schools data for GitHub Pages deployment
// This replaces the backend API calls with static data

// Import the JSON data (you'll need to copy serbian_schools.json here)
import schoolsData from './serbian_schools.json';

// Helper functions from backend
function latinToCyrillic(text) {
  if (!text) return text;
  
  const latinToCyrillicMap = {
    'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д', 'đ': 'ђ', 'e': 'е',
    'ž': 'ж', 'z': 'з', 'i': 'и', 'j': 'ј', 'k': 'к', 'l': 'л', 'm': 'м',
    'n': 'н', 'nj': 'њ', 'o': 'о', 'p': 'п', 'r': 'р', 's': 'с', 't': 'т',
    'ć': 'ћ', 'u': 'у', 'f': 'ф', 'h': 'х', 'c': 'ц', 'č': 'ч', 'dž': 'џ',
    'š': 'ш',
    'A': 'А', 'B': 'Б', 'V': 'В', 'G': 'Г', 'D': 'Д', 'Đ': 'Ђ', 'E': 'Е',
    'Ž': 'Ж', 'Z': 'З', 'I': 'И', 'J': 'Ј', 'K': 'К', 'L': 'Л', 'M': 'М',
    'N': 'Н', 'Nj': 'Њ', 'NJ': 'Њ', 'O': 'О', 'P': 'П', 'R': 'Р', 'S': 'С', 
    'T': 'Т', 'Ć': 'Ћ', 'U': 'У', 'F': 'Ф', 'H': 'Х', 'C': 'Ц', 'Č': 'Ч', 
    'Dž': 'Џ', 'DŽ': 'Џ', 'Š': 'Ш'
  };
  
  let result = text;
  
  // Convert multi-character combinations first
  const multiChar = [['nj', 'њ'], ['Nj', 'Њ'], ['NJ', 'Њ'], ['dž', 'џ'], ['Dž', 'Џ'], ['DŽ', 'Џ']];
  multiChar.forEach(([latin, cyrillic]) => {
    result = result.replace(new RegExp(latin, 'g'), cyrillic);
  });
  
  // Convert single characters
  Object.entries(latinToCyrillicMap).forEach(([latin, cyrillic]) => {
    if (latin.length === 1) {
      result = result.replace(new RegExp(latin, 'g'), cyrillic);
    }
  });
  
  return result;
}

function generateCyrillicVariants(text) {
  if (!text) return [text];
  
  const variants = [latinToCyrillic(text)];
  
  if (text.toLowerCase().includes('c')) {
    const variantCAcute = text.replace(/c/g, 'ћ').replace(/C/g, 'Ћ');
    variants.push(latinToCyrillic(variantCAcute));
    
    const variantCH = text.replace(/c/g, 'ч').replace(/C/g, 'Ч');
    variants.push(latinToCyrillic(variantCH));
  }
  
  return [...new Set(variants)];
}

// Process schools data
const processedSchools = schoolsData
  .filter(school => school.statistics.eighthGradeStudentsCount > 0)
  .map(school => ({
    id: school.statistics.id,
    name: school.school_name,
    district: school.district_name,
    municipality: school.municipality_name,
    total_points: school.statistics.totalPoints,
    students_count: school.statistics.eighthGradeStudentsCount,
    finished_students: school.statistics.finishedSchoolStudentsCount,
    vukova_diploma: school.statistics.hasVukovaDiplomaStudentsCount,
    grade_6_avg: school.statistics.sixthGradeAverage,
    grade_7_avg: school.statistics.seventhGradeAverage,
    grade_8_avg: school.statistics.eighthGradeAverage,
    total_grade_avg: school.statistics.totalAverageGrade,
    test_points_avg: school.statistics.totalTestPointsAverage,
    address: school.statistics.address,
    website: school.statistics.website,
    email: school.statistics.email,
  }));

// Static API functions
export const staticAPI = {
  fetchOverviewStats: () => {
    const totalSchools = processedSchools.length;
    const totalStudents = processedSchools.reduce((sum, school) => sum + school.students_count, 0);
    const avgPoints = processedSchools.reduce((sum, school) => sum + school.total_points, 0) / totalSchools;
    const sortedPoints = processedSchools.map(s => s.total_points).sort((a, b) => a - b);
    const medianPoints = sortedPoints[Math.floor(sortedPoints.length / 2)];
    
    return Promise.resolve({
      data: {
        total_schools: totalSchools,
        total_students: totalStudents,
        avg_points: Math.round(avgPoints * 100) / 100,
        median_points: Math.round(medianPoints * 100) / 100,
      }
    });
  },

  fetchDistricts: () => {
    const districtMap = {};
    
    processedSchools.forEach(school => {
      if (!districtMap[school.district]) {
        districtMap[school.district] = {
          name: school.district,
          schools: [],
          total_students: 0,
        };
      }
      districtMap[school.district].schools.push(school);
      districtMap[school.district].total_students += school.students_count;
    });
    
    const districts = Object.values(districtMap).map(district => ({
      name: district.name,
      avg_points: Math.round((district.schools.reduce((sum, s) => sum + s.total_points, 0) / district.schools.length) * 100) / 100,
      school_count: district.schools.length,
      total_students: district.total_students,
    }));
    
    return Promise.resolve({
      data: districts.sort((a, b) => b.avg_points - a.avg_points)
    });
  },

  fetchSchools: (params = {}) => {
    let filtered = [...processedSchools];
    
    // Apply filters
    if (params.school_name) {
      const searchVariants = generateCyrillicVariants(params.school_name.toLowerCase());
      searchVariants.push(params.school_name.toLowerCase());
      
      filtered = filtered.filter(school => 
        searchVariants.some(variant => 
          school.name.toLowerCase().includes(variant)
        )
      );
    }
    
    if (params.district) {
      filtered = filtered.filter(school => school.district === params.district);
    }
    
    if (params.municipality) {
      filtered = filtered.filter(school => school.municipality === params.municipality);
    }
    
    if (params.min_points) {
      filtered = filtered.filter(school => school.total_points >= params.min_points);
    }
    
    if (params.max_points) {
      filtered = filtered.filter(school => school.total_points <= params.max_points);
    }
    
    // Sort
    const sortBy = params.sort_by || 'total_points';
    const ascending = params.sort_order === 'asc';
    
    filtered.sort((a, b) => {
      const aVal = a[sortBy] || 0;
      const bVal = b[sortBy] || 0;
      return ascending ? aVal - bVal : bVal - aVal;
    });
    
    // Pagination
    const limit = params.limit || 50;
    const offset = params.offset || 0;
    const totalCount = filtered.length;
    const schools = filtered.slice(offset, offset + limit);
    
    return Promise.resolve({
      data: {
        schools: schools.map(school => ({
          ...school,
          grade_6_avg: school.grade_6_avg ? Math.round(school.grade_6_avg * 100) / 100 : null,
          grade_7_avg: school.grade_7_avg ? Math.round(school.grade_7_avg * 100) / 100 : null,
          grade_8_avg: school.grade_8_avg ? Math.round(school.grade_8_avg * 100) / 100 : null,
        })),
        total_count: totalCount,
        has_more: offset + limit < totalCount,
      }
    });
  },

  fetchSchoolDetail: (id) => {
    const school = processedSchools.find(s => s.id === parseInt(id));
    if (!school) {
      return Promise.reject({ response: { status: 404 } });
    }
    
    const totalPointsPercentile = (processedSchools.filter(s => s.total_points < school.total_points).length / processedSchools.length) * 100;
    
    return Promise.resolve({
      data: {
        ...school,
        percentile: Math.round(totalPointsPercentile * 10) / 10,
        vukova_percentage: school.finished_students > 0 ? 
          Math.round((school.vukova_diploma / school.finished_students) * 1000) / 10 : 0,
        grades: {
          grade_6: school.grade_6_avg ? Math.round(school.grade_6_avg * 100) / 100 : null,
          grade_7: school.grade_7_avg ? Math.round(school.grade_7_avg * 100) / 100 : null,
          grade_8: school.grade_8_avg ? Math.round(school.grade_8_avg * 100) / 100 : null,
          total_avg: school.total_grade_avg ? Math.round(school.total_grade_avg * 100) / 100 : null,
        },
        test_points_avg: school.test_points_avg ? Math.round(school.test_points_avg * 100) / 100 : null,
        contact: {
          address: school.address,
          website: school.website,
          email: school.email,
        },
      }
    });
  },

  fetchTopSchools: (limit = 10) => {
    const topSchools = [...processedSchools]
      .sort((a, b) => b.total_points - a.total_points)
      .slice(0, limit);
    
    return Promise.resolve({
      data: topSchools.map(school => ({
        id: school.id,
        name: school.name,
        municipality: school.municipality,
        total_points: Math.round(school.total_points * 100) / 100,
        students_count: school.students_count,
      }))
    });
  },

  fetchDistrictComparison: () => {
    const districtMap = {};
    
    processedSchools.forEach(school => {
      if (!districtMap[school.district]) {
        districtMap[school.district] = {
          district: school.district,
          schools: [],
          total_students: 0,
          total_vukova: 0,
        };
      }
      districtMap[school.district].schools.push(school);
      districtMap[school.district].total_students += school.students_count;
      districtMap[school.district].total_vukova += school.vukova_diploma;
    });
    
    const districts = Object.values(districtMap).map(district => ({
      district: district.district,
      avg_points: Math.round((district.schools.reduce((sum, s) => sum + s.total_points, 0) / district.schools.length) * 100) / 100,
      total_students: district.total_students,
      total_vukova: district.total_vukova,
    }));
    
    return Promise.resolve({
      data: districts.sort((a, b) => b.avg_points - a.avg_points)
    });
  }
};
