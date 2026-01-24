from pydantic import BaseModel
from muscle.engines.common.identity_stub import RequestContext

class ComputeInput(BaseModel):
    value: int

async def handle_compute(ctx: RequestContext, args: ComputeInput):
    return {"result": args.value * 2}
