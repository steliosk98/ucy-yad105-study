"""Flatten a UCY knowledge-bank export into the compact bank the app loads.

    python tools/build_data.py data/source_knowledge_bank.json
"""
import json
import sys
from pathlib import Path

src_path = Path(sys.argv[1] if len(sys.argv) > 1 else 'data/source_knowledge_bank.json')
out_path = Path('data/questions.json')

src = json.loads(src_path.read_text(encoding='utf-8'))

topics = [{
    'id': t['topic_id'],
    'en': t['title_en'],
    'el': t['title_el'],
    'priority': t['priority'],
    'count': len(t['questions']),
} for t in src['topics']]

questions = [{
    'id': q['id'],
    'n': q['original_number'],
    't': q['topic_id'],
    'qe': q['question_en'], 'qg': q['question_el'],
    'ae': q['answer_en'], 'ag': q['answer_el'],
    'd': q['difficulty'],
    'tags': q['tags'],
} for t in src['topics'] for q in t['questions']]

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
print(f'{out_path}: {len(questions)} questions, {len(topics)} topics')
