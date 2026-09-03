"""Unit tests for scripts/gpatents.py and scripts/check_new_patents.py.

These tests do not touch the network. They exercise the pure parsing/diff
functions against scripts/tests/fixtures/gpatents_search_response.sample.json,
which is a SYNTHETIC fixture the author wrote by hand to mimic the documented
shape of the Google Patents /xhr/query response - see the comment inside that
fixture file and the module docstrings in gpatents.py / check_new_patents.py
for why: this environment has no network access to patents.google.com, so the
real response shape has not been verified here.

Run with:
    python3 -m unittest discover -s scripts/tests -v
"""

from __future__ import annotations

import json
import sys
import unittest
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS_DIR))

from gpatents import GooglePatentsError, extract_known_ids, parse_search_payload  # noqa: E402
from check_new_patents import diff_new_ids  # noqa: E402

FIXTURE = SCRIPTS_DIR / "tests/fixtures/gpatents_search_response.sample.json"


def load_fixture() -> dict:
    return json.loads(FIXTURE.read_text(encoding="utf-8"))


class ParseSearchPayloadTests(unittest.TestCase):
    def test_normal_payload_parses_expected_hits(self):
        payload = load_fixture()
        result = parse_search_payload(payload)
        self.assertEqual(result["total_num_results"], 3)
        ids = {hit["id"] for hit in result["hits"]}
        # The fixture has 4 result entries, one with a blank publication_number
        # that must be skipped, leaving 3 usable hits.
        self.assertEqual(ids, {"JP2019132766A", "JP2099999999A", "JP2016080631A"})

    def test_hit_fields_are_carried_through(self):
        result = parse_search_payload(load_fixture())
        by_id = {hit["id"]: hit for hit in result["hits"]}
        new_one = by_id["JP2099999999A"]
        self.assertEqual(new_one["publication_date"], "20250101")
        self.assertEqual(new_one["country_code"], "JP")

    def test_missing_results_key_raises(self):
        with self.assertRaises(GooglePatentsError):
            parse_search_payload({})

    def test_missing_cluster_key_raises(self):
        # total_num_results present but 'cluster' missing entirely -> layout
        # change, must raise (not be treated as zero hits).
        with self.assertRaises(GooglePatentsError):
            parse_search_payload({"results": {"total_num_results": 0}})

    def test_genuine_zero_hits_does_not_raise(self):
        # An empty but present cluster list is a legitimate "zero results".
        result = parse_search_payload({"results": {"total_num_results": 0, "cluster": []}})
        self.assertEqual(result["total_num_results"], 0)
        self.assertEqual(result["hits"], [])

    def test_error_field_raises(self):
        with self.assertRaises(GooglePatentsError):
            parse_search_payload({"error": "rate limited"})


class ExtractKnownIdsTests(unittest.TestCase):
    def test_extracts_ids_from_multiline_catalog_format(self):
        text = """
        export const patents: PatentRecord[] = [
          {
            id: "JP2014025702A",
            title: "example",
          },
          {
            id: "JP2019132766A",
            title: "example 2",
          },
        ];
        """
        self.assertEqual(extract_known_ids(text), ["JP2014025702A", "JP2019132766A"])

    def test_empty_catalog_raises(self):
        with self.assertRaises(GooglePatentsError):
            extract_known_ids("export const patents: PatentRecord[] = [];")


class DiffNewIdsTests(unittest.TestCase):
    def test_no_difference_means_no_new_ids(self):
        ids = {"JP2019132766A", "JP2016080631A"}
        self.assertEqual(diff_new_ids(ids, ids), [])

    def test_one_missing_known_id_is_detected_as_new(self):
        """This is the scenario requested for manual verification: drop one id
        from the "known" set and confirm it is reported as newly discovered."""
        fixture_ids = {hit["id"] for hit in parse_search_payload(load_fixture())["hits"]}
        known_ids = fixture_ids - {"JP2016080631A"}
        new_ids = diff_new_ids(known_ids, fixture_ids)
        self.assertEqual(new_ids, ["JP2016080631A"])

    def test_two_missing_known_ids_are_both_detected_and_sorted(self):
        fixture_ids = {hit["id"] for hit in parse_search_payload(load_fixture())["hits"]}
        known_ids: set[str] = set()
        new_ids = diff_new_ids(known_ids, fixture_ids)
        self.assertEqual(new_ids, sorted(fixture_ids))


if __name__ == "__main__":
    unittest.main()
