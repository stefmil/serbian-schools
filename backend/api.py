import json
from typing import Dict, List, Optional

import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS


def latin_to_cyrillic(text):
    """Convert Serbian Latin text to Cyrillic"""
    if not text:
        return text
    
    # Serbian Latin to Cyrillic mapping
    latin_to_cyrillic_map = {
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
    }
    
    # Convert multi-character combinations first
    result = text
    for latin, cyrillic in [('nj', 'њ'), ('Nj', 'Њ'), ('NJ', 'Њ'), ('dž', 'џ'), ('Dž', 'Џ'), ('DŽ', 'Џ')]:
        result = result.replace(latin, cyrillic)
    
    # Convert single characters
    for latin, cyrillic in latin_to_cyrillic_map.items():
        if len(latin) == 1:  # Skip multi-character combinations already processed
            result = result.replace(latin, cyrillic)
    
    return result


def generate_cyrillic_variants(text):
    """Generate possible Cyrillic variants for ambiguous Latin characters"""
    if not text:
        return [text]
    
    variants = [latin_to_cyrillic(text)]
    
    # Handle ambiguous 'c' character - can be ћ, ч, or ц
    if 'c' in text.lower():
        # Create variants with c -> ћ
        variant_c_to_c_acute = text.replace('c', 'ћ').replace('C', 'Ћ')
        variants.append(latin_to_cyrillic(variant_c_to_c_acute))
        
        # Create variants with c -> ч  
        variant_c_to_ch = text.replace('c', 'ч').replace('C', 'Ч')
        variants.append(latin_to_cyrillic(variant_c_to_ch))
        
        # The default c -> ц is already handled in latin_to_cyrillic
    
    # Remove duplicates while preserving order
    unique_variants = []
    for variant in variants:
        if variant not in unique_variants:
            unique_variants.append(variant)
    
    return unique_variants


class SchoolDataAPI:
    def __init__(self, json_file_path: str):
        self.app = Flask(__name__)
        CORS(self.app)  # Enable CORS for frontend

        # Load and process data
        with open(json_file_path, "r", encoding="utf-8") as f:
            self.raw_data = json.load(f)

        # Filter active schools
        self.schools = [
            school
            for school in self.raw_data
            if school["statistics"]["eighthGradeStudentsCount"] > 0
        ]

        self.df = self.create_dataframe()
        self.setup_routes()

    def create_dataframe(self):
        """Create pandas DataFrame from JSON data"""
        rows = []
        for school in self.schools:
            stats = school["statistics"]
            row = {
                "id": stats["id"],
                "district_name": school["district_name"],
                "municipality_name": school["municipality_name"],
                "school_name": school["school_name"],
                "students_count": stats["eighthGradeStudentsCount"],
                "finished_students": stats["finishedSchoolStudentsCount"],
                "vukova_diploma": stats["hasVukovaDiplomaStudentsCount"],
                "total_points": stats["totalPoints"],
                "grade_6_avg": stats["sixthGradeAverage"],
                "grade_7_avg": stats["seventhGradeAverage"],
                "grade_8_avg": stats["eighthGradeAverage"],
                "total_grade_avg": stats["totalAverageGrade"],
                "test_points_avg": stats["totalTestPointsAverage"],
                "address": stats["address"],
                "website": stats["website"],
                "email": stats["email"],
            }
            rows.append(row)
        return pd.DataFrame(rows)

    def setup_routes(self):
        @self.app.route("/api/stats/overview")
        def get_overview_stats():
            """Get basic overview statistics"""
            return jsonify(
                {
                    "total_schools": len(self.schools),
                    "total_students": int(self.df["students_count"].sum()),
                    "avg_points": round(self.df["total_points"].mean(), 2),
                    "median_points": round(self.df["total_points"].median(), 2),
                    "std_points": round(self.df["total_points"].std(), 2),
                }
            )

        @self.app.route("/api/districts")
        def get_districts():
            """Get all districts with their stats"""
            districts = (
                self.df.groupby("district_name")
                .agg({"total_points": ["mean", "count"], "students_count": "sum"})
                .round(2)
            )

            result = []
            for district, data in districts.iterrows():
                result.append(
                    {
                        "name": district,
                        "avg_points": data[("total_points", "mean")],
                        "school_count": data[("total_points", "count")],
                        "total_students": data[("students_count", "sum")],
                    }
                )

            return jsonify(sorted(result, key=lambda x: x["avg_points"], reverse=True))

        @self.app.route("/api/schools")
        def get_schools():
            """Get schools with filtering and pagination"""
            # Query parameters
            school_name = request.args.get("school_name")
            district = request.args.get("district")
            municipality = request.args.get("municipality")
            min_points = request.args.get("min_points", type=float)
            max_points = request.args.get("max_points", type=float)
            limit = request.args.get("limit", 50, type=int)
            offset = request.args.get("offset", 0, type=int)
            sort_by = request.args.get("sort_by", "total_points")
            sort_order = request.args.get("sort_order", "desc")

            # Filter data
            filtered_df = self.df.copy()

            if school_name:
                # Generate all possible Cyrillic variants for ambiguous characters
                search_variants = generate_cyrillic_variants(school_name.lower())
                search_variants.append(school_name.lower())  # Add original Latin term
                
                # Create a mask that searches for any of the variants
                mask = pd.Series([False] * len(filtered_df), index=filtered_df.index)
                
                for variant in search_variants:
                    variant_mask = filtered_df["school_name"].str.lower().str.contains(variant, case=False, na=False)
                    mask = mask | variant_mask
                
                filtered_df = filtered_df[mask]
            if district:
                filtered_df = filtered_df[filtered_df["district_name"] == district]
            if municipality:
                filtered_df = filtered_df[
                    filtered_df["municipality_name"] == municipality
                ]
            if min_points:
                filtered_df = filtered_df[filtered_df["total_points"] >= min_points]
            if max_points:
                filtered_df = filtered_df[filtered_df["total_points"] <= max_points]

            # Sort data
            ascending = sort_order.lower() == 'asc'
            if sort_by in filtered_df.columns:
                filtered_df = filtered_df.sort_values(sort_by, ascending=ascending)
            else:
                # Default sort by total points descending
                filtered_df = filtered_df.sort_values("total_points", ascending=False)

            # Pagination
            total_count = len(filtered_df)
            paginated_df = filtered_df.iloc[offset : offset + limit]

            # Convert to JSON
            schools = []
            for _, school in paginated_df.iterrows():
                schools.append(
                    {
                        "id": int(school["id"]),
                        "name": school["school_name"],
                        "district": school["district_name"],
                        "municipality": school["municipality_name"],
                        "total_points": round(school["total_points"], 2),
                        "students_count": int(school["students_count"]),
                        "vukova_diploma": int(school["vukova_diploma"]),
                        "grade_6_avg": (
                            round(school["grade_6_avg"], 2)
                            if pd.notna(school["grade_6_avg"])
                            else None
                        ),
                        "grade_7_avg": (
                            round(school["grade_7_avg"], 2)
                            if pd.notna(school["grade_7_avg"])
                            else None
                        ),
                        "grade_8_avg": (
                            round(school["grade_8_avg"], 2)
                            if pd.notna(school["grade_8_avg"])
                            else None
                        ),
                        "address": school["address"],
                        "website": school["website"],
                        "email": school["email"],
                    }
                )

            return jsonify(
                {
                    "schools": schools,
                    "total_count": total_count,
                    "has_more": offset + limit < total_count,
                }
            )

        @self.app.route("/api/schools/<int:school_id>")
        def get_school_detail(school_id):
            """Get detailed info for specific school"""
            school_data = self.df[self.df["id"] == school_id]

            if school_data.empty:
                return jsonify({"error": "School not found"}), 404

            school = school_data.iloc[0]

            # Calculate percentiles
            total_points_percentile = (
                self.df["total_points"] < school["total_points"]
            ).mean() * 100

            return jsonify(
                {
                    "id": int(school["id"]),
                    "name": school["school_name"],
                    "district": school["district_name"],
                    "municipality": school["municipality_name"],
                    "total_points": round(school["total_points"], 2),
                    "percentile": round(total_points_percentile, 1),
                    "students_count": int(school["students_count"]),
                    "finished_students": int(school["finished_students"]),
                    "vukova_diploma": int(school["vukova_diploma"]),
                    "vukova_percentage": (
                        round(
                            (
                                school["vukova_diploma"]
                                / school["finished_students"]
                                * 100
                            ),
                            1,
                        )
                        if school["finished_students"] > 0
                        else 0
                    ),
                    "grades": {
                        "grade_6": (
                            round(school["grade_6_avg"], 2)
                            if pd.notna(school["grade_6_avg"])
                            else None
                        ),
                        "grade_7": (
                            round(school["grade_7_avg"], 2)
                            if pd.notna(school["grade_7_avg"])
                            else None
                        ),
                        "grade_8": (
                            round(school["grade_8_avg"], 2)
                            if pd.notna(school["grade_8_avg"])
                            else None
                        ),
                        "total_avg": (
                            round(school["total_grade_avg"], 2)
                            if pd.notna(school["total_grade_avg"])
                            else None
                        ),
                    },
                    "test_points_avg": (
                        round(school["test_points_avg"], 2)
                        if pd.notna(school["test_points_avg"])
                        else None
                    ),
                    "contact": {
                        "address": school["address"],
                        "website": school["website"],
                        "email": school["email"],
                    },
                }
            )

        @self.app.route("/api/analysis/top-schools")
        def get_top_schools():
            """Get top performing schools"""
            limit = request.args.get("limit", 10, type=int)

            top_schools = self.df.nlargest(limit, "total_points")

            result = []
            for _, school in top_schools.iterrows():
                result.append(
                    {
                        "id": int(school["id"]),
                        "name": school["school_name"],
                        "municipality": school["municipality_name"],
                        "total_points": round(school["total_points"], 2),
                        "students_count": int(school["students_count"]),
                    }
                )

            return jsonify(result)

        @self.app.route("/api/analysis/district-comparison")
        def get_district_comparison():
            """Get district comparison data for charts"""
            district_stats = (
                self.df.groupby("district_name")
                .agg(
                    {
                        "total_points": "mean",
                        "students_count": "sum",
                        "vukova_diploma": "sum",
                    }
                )
                .round(2)
            )

            result = []
            for district, data in district_stats.iterrows():
                result.append(
                    {
                        "district": district,
                        "avg_points": data["total_points"],
                        "total_students": int(data["students_count"]),
                        "total_vukova": int(data["vukova_diploma"]),
                    }
                )

            return jsonify(sorted(result, key=lambda x: x["avg_points"], reverse=True))

    def run(self, debug=True, port=5000):
        self.app.run(debug=debug, port=port)


if __name__ == "__main__":
    api = SchoolDataAPI("serbian_schools.json")
    api.run()
