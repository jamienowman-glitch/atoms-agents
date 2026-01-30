import typer
import logging
from atoms_tuning.ingest import Ingestor

app = typer.Typer()
logger = logging.getLogger("atoms-tuning")

@app.command()
def ingest(loop: bool = False):
    """
    Starts the ingestion process.
    If --loop is passed, runs continuously. Otherwise runs a single batch until caught up.
    """
    ingestor = Ingestor()

    if loop:
        logger.info("Starting ingestion loop...")
        ingestor.run_loop()
    else:
        logger.info("Running single ingestion pass...")
        count = 0
        while True:
            batch_count = ingestor.run_batch()
            count += batch_count
            if batch_count == 0:
                break
        logger.info(f"Completed. Processed {count} events.")

if __name__ == "__main__":
    app()
