import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaGlobalArticle } from "../target/types/solana_global_article";

describe("solana-global-article", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.SolanaGlobalArticle as Program<SolanaGlobalArticle>;
  const deployerKeypair = anchor.web3.Keypair.generate();

  it("Is initialized", async () => {
    const authority = (program.provider as anchor.AnchorProvider).wallet;

    // Add your test here.
    await program.methods
      .initialize()
      .accounts({
        article: deployerKeypair.publicKey,
        authority: authority.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([deployerKeypair])
      .rpc();
  });
});
