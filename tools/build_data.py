"""Flatten the UCY knowledge-bank export into the compact bank the app loads.

    python tools/build_data.py [path/to/source_knowledge_bank.json]

The supplied export is never edited. The Greek that ships is the revised
translation in data/el/*.json (keyed by question id), layered over the export;
anything without an override falls back to the export's own Greek.
"""
import json
import sys
from pathlib import Path

src_path = Path(sys.argv[1] if len(sys.argv) > 1 else 'data/source_knowledge_bank.json')
out_path = Path('data/questions.json')
el_dir = Path('data/el')

src = json.loads(src_path.read_text(encoding='utf-8'))

overrides = {}
for f in sorted(el_dir.glob('*.json')):
    for qid, fields in json.loads(f.read_text(encoding='utf-8')).items():
        if qid in overrides:
            raise SystemExit(f'{f.name}: {qid} is already translated in another file')
        overrides[qid] = fields

topics = [{
    'id': t['topic_id'],
    'en': t['title_en'],
    'el': t['title_el'],
    'priority': t['priority'],
    'count': len(t['questions']),
} for t in src['topics']]

questions = []
for t in src['topics']:
    for q in t['questions']:
        el = overrides.get(q['id'], {})
        questions.append({
            'id': q['id'],
            'n': q['original_number'],
            't': q['topic_id'],
            'qe': q['question_en'], 'qg': el.get('qg', q['question_el']),
            'ae': q['answer_en'], 'ag': el.get('ag', q['answer_el']),
            'd': q['difficulty'],
            'tags': q['tags'],
        })

unknown = set(overrides) - {q['id'] for q in questions}
if unknown:
    raise SystemExit(f'overrides for unknown ids: {sorted(unknown)}')

v = src['vacancy']
out = {
    'meta': {
        'title': src['document_title'],
        'position_en': v['position_en'], 'position_el': v['position_el'],
        'reference': v['reference'], 'organization': v['organization'],
        'weight': v['technical_exam_weight_percent'],
    },
    'topics': topics,
    'questions': questions,
}

out_path.write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
done = len(overrides)
print(f'{out_path}: {len(questions)} questions, {len(topics)} topics, '
      f'{done} revised Greek ({done * 100 // len(questions)}%)')
