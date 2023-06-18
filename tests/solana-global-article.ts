import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaGlobalArticle } from "../target/types/solana_global_article";
import { expect } from "chai";

describe("solana-global-article", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.SolanaGlobalArticle as Program<SolanaGlobalArticle>;

  const deployerKeypair = anchor.web3.Keypair.generate();
  const initialText = "Story: ";

  it("Is initialized", async () => {
    const authority = (program.provider as anchor.AnchorProvider).wallet;

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

  it("Should write an article with 1 word successfully", async () => {
    // 没必要重复初始化程序了 --报错：custom program error: 0x0
    await program.methods
      .writeIntoArticle("Hi")
      .accounts({
        article: deployerKeypair.publicKey,
      })
      .signers([])
      .rpc();

    const articleData = await program.account.article.fetch(deployerKeypair.publicKey);
    expect(articleData.content).to.equal(initialText + "Hi ");
  });

  it("should write 3 words two times", async () => {
    await program.methods
      .writeIntoArticle("hey whats up")
      .accounts({
        article: deployerKeypair.publicKey,
      })
      .signers([])
      .rpc();

    await program.methods
      .writeIntoArticle("do my own")
      .accounts({
        article: deployerKeypair.publicKey,
      })
      .signers([])
      .rpc();

    const articleData = await program.account.article.fetch(deployerKeypair.publicKey);
    expect(articleData.content).to.equal(initialText + "Hi hey whats up do my own ");
  });
});
