
from northstar.core.events import Event, EventEmitter

def test_event_emission():
    emitter = EventEmitter()
    received = []
    
    def handler(e):
        received.append(e)
        
    emitter.on("test_event", handler)
    
    event = Event(type="test_event", source="test", payload={"foo": "bar"})
    emitter.emit(event)
    
    assert len(received) == 1
    assert received[0].type == "test_event"
    assert received[0].payload["foo"] == "bar"
    assert len(emitter.get_history()) == 1

def test_history_clear():
    emitter = EventEmitter()
    emitter.emit(Event(type="a", source="s"))
    assert len(emitter.get_history()) == 1
    emitter.clear_history()
    assert len(emitter.get_history()) == 0
