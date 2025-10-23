import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const API_URL = 'https://functions.poehali.dev/8f090354-2018-4844-a0e6-010d048a0143';

export default function Index() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Введите имя для поиска');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (response.ok) {
        setSuggestions(data.suggestions || []);
      } else {
        setError(data.error || 'Ошибка при получении данных');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Badge variant="outline" className="bg-primary text-primary-foreground border-0">v1.0</Badge>
            <span className="text-sm font-medium">Name Autocomplete API</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            API Автодополнения Имен
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Современный REST API для поиска и автодополнения русских имен в режиме реального времени
          </p>
        </div>

        <Card className="mb-12 p-8 bg-card border-border">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-lg bg-secondary/20">
              <Icon name="Zap" size={24} className="text-secondary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Попробуйте API</h2>
              <p className="text-muted-foreground">Введите начало имени и получите список подходящих вариантов</p>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <Input
              type="text"
              placeholder="Введите имя, например: Ал"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-input border-border text-foreground"
            />
            <Button 
              onClick={handleSearch} 
              disabled={isLoading}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8"
            >
              {isLoading ? (
                <Icon name="Loader2" className="animate-spin" size={20} />
              ) : (
                <span>Поиск</span>
              )}
            </Button>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive mb-6">
              <div className="flex items-center gap-2">
                <Icon name="AlertCircle" size={20} />
                <span>{error}</span>
              </div>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="CheckCircle2" size={16} className="text-accent" />
                <span>Найдено совпадений: {suggestions.length}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((name, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="px-4 py-2 text-base bg-secondary/20 hover:bg-secondary/30 border border-secondary/30 transition-all"
                  >
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/20">
                <Icon name="Code2" size={20} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold">Endpoint</h3>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 font-mono text-sm overflow-x-auto">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-accent text-accent-foreground text-xs">GET</Badge>
                <span className="text-accent">/autocomplete</span>
              </div>
              <div className="text-muted-foreground text-xs">
                {API_URL}
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-secondary/20">
                <Icon name="Settings2" size={20} className="text-secondary" />
              </div>
              <h3 className="text-xl font-bold">Параметры</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">query</Badge>
                <div>
                  <div className="font-medium mb-1">string (обязательный)</div>
                  <div className="text-sm text-muted-foreground">Начало имени для поиска</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-card border-border mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-accent/20">
              <Icon name="Terminal" size={20} className="text-accent" />
            </div>
            <h3 className="text-xl font-bold">Примеры использования</h3>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Code" size={16} className="text-primary" />
                <span className="font-semibold text-sm">cURL</span>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 font-mono text-sm overflow-x-auto">
                <code className="text-accent">curl</code> <code className="text-muted-foreground">"{API_URL}?query=Ал"</code>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Code" size={16} className="text-secondary" />
                <span className="font-semibold text-sm">JavaScript (fetch)</span>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 font-mono text-sm overflow-x-auto">
                <pre className="text-muted-foreground">
{`const response = await fetch('${API_URL}?query=Ал');
const data = await response.json();
console.log(data.suggestions);`}
                </pre>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Code" size={16} className="text-accent" />
                <span className="font-semibold text-sm">Response (200 OK)</span>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 font-mono text-sm overflow-x-auto">
                <pre className="text-muted-foreground">
{`{
  "query": "Ал",
  "suggestions": [
    "Александр",
    "Александра",
    "Алексей",
    "Алена",
    "Алина",
    "Алиса"
  ],
  "count": 6
}`}
                </pre>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/20">
              <Icon name="Info" size={20} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold">Описание проекта</h3>
          </div>

          <div className="space-y-4 text-muted-foreground">
            <p>
              <strong className="text-foreground">Name Autocomplete API</strong> — это облачный сервис для быстрого поиска и автодополнения русских имен. 
              API использует базу данных популярных имен и возвращает до 10 наиболее подходящих вариантов.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <Icon name="Zap" size={20} className="text-accent flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-foreground mb-1">Мгновенный отклик</div>
                  <div className="text-sm">Средняя задержка &lt;100ms</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Icon name="Database" size={20} className="text-secondary flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-foreground mb-1">База имен</div>
                  <div className="text-sm">Более 80 популярных русских имен</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Icon name="Globe" size={20} className="text-primary flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-foreground mb-1">CORS enabled</div>
                  <div className="text-sm">Вызов из любого домена</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Icon name="ShieldCheck" size={20} className="text-accent flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-foreground mb-1">Надежность</div>
                  <div className="text-sm">Развернут на облачной платформе</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
