import json
from typing import Dict, Any, List

# База популярных имен для автодополнения
NAMES_DATABASE: List[str] = [
    "Александр", "Александра", "Алексей", "Алена", "Алина", "Алиса",
    "Анастасия", "Анатолий", "Андрей", "Анна", "Антон", "Артем", "Артур",
    "Богдан", "Борис",
    "Вадим", "Валентин", "Валентина", "Валерий", "Валерия", "Варвара", "Василий", "Вера", "Виктор", "Виктория", "Владимир", "Владислав", "Всеволод",
    "Галина", "Георгий", "Глеб", "Григорий",
    "Даниил", "Дарья", "Денис", "Диана", "Дмитрий",
    "Евгений", "Евгения", "Егор", "Екатерина", "Елена", "Елизавета",
    "Игорь", "Илья", "Инна", "Ирина",
    "Кирилл", "Константин", "Ксения",
    "Лариса", "Лев", "Леонид", "Лилия", "Любовь", "Людмила",
    "Максим", "Маргарита", "Марина", "Мария", "Матвей", "Михаил",
    "Надежда", "Наталья", "Никита", "Николай", "Нина",
    "Ольга", "Олег",
    "Павел", "Петр", "Полина",
    "Роман", "Ростислав",
    "Светлана", "Семен", "Сергей", "Софья", "Станислав", "Степан",
    "Тамара", "Татьяна", "Тимофей", "Тимур",
    "Федор",
    "Юлия", "Юрий",
    "Ярослав"
]


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для автодополнения имен при вводе
    Args: event с httpMethod, queryStringParameters (query)
    Returns: HTTP response с массивом подходящих имен
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # CORS preflight
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        query: str = params.get('query', '').strip()
        
        if not query:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'error': 'Query parameter is required',
                    'example': '/api/autocomplete?query=Ал'
                })
            }
        
        # Поиск имен, начинающихся с введенного текста (регистронезависимо)
        query_lower = query.lower()
        suggestions: List[str] = [
            name for name in NAMES_DATABASE 
            if name.lower().startswith(query_lower)
        ]
        
        # Ограничиваем до 10 результатов
        suggestions = suggestions[:10]
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'query': query,
                'suggestions': suggestions,
                'count': len(suggestions)
            }, ensure_ascii=False)
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }