from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain, SequentialChain
from langchain_community.llms import Ollama
from langchain_openai import ChatOpenAI

llm = Ollama(model="mistral")

def load_prompt(file_path):
    with open(file_path, "r") as f:
        return f.read()
    
def get_llm(provider: str = "ollama", api_key: str = None):
    """
    LLM sağlayıcısına göre uygun LLM nesnesini döner.
    """
    if provider == "ollama":
        return Ollama(model="mistral")
    elif provider == "openai":
        if not api_key:
            raise ValueError("OpenAI API key is required when using 'openai' provider.")
        return ChatOpenAI(
            model="gpt-4",
            temperature=0.7,
            openai_api_key=api_key
        )
    else:
        raise ValueError(f"Unsupported provider: {provider}")
    
def get_review_chain(provider: str = "ollama", api_key: str = None):
    llm = get_llm(provider, api_key)

    # Load prompts from files
    architecture_prompt = load_prompt("prompts/architecture_prompt.txt")
    security_prompt = load_prompt("prompts/security_prompt.txt")
    product_owner_prompt = load_prompt("prompts/product_owner_prompt.txt")
    devops_prompt = load_prompt("prompts/devops_prompt.txt")

    # Create prompt templates
    architecture_template = PromptTemplate(
        input_variables=["code"],
        template=architecture_prompt,
    )

    security_template = PromptTemplate(
        input_variables=["code", "architecture_review"],
        template=security_prompt,
    )

    product_owner_template = PromptTemplate(
        input_variables=["code", "architecture_review", "security_review"],
        template=product_owner_prompt,
    )

    devops_template = PromptTemplate(
        input_variables=["code", "architecture_review", "security_review", "product_owner_review"],
        template=devops_prompt,
    )

    # Create chains
    architect_chain = LLMChain(
        llm=llm, 
        prompt=architecture_template,
        output_key="architecture_review"
    )

    security_chain = LLMChain(
        llm=llm,
        prompt=security_template,
        output_key="security_review",
    )

    product_owner_chain = LLMChain(
        llm=llm,
        prompt=product_owner_template,
        output_key="product_owner_review",
    )

    devops_chain = LLMChain(
        llm=llm,
        prompt=devops_template,
        output_key="devops_review",
    )

    # Combine chains into a sequential chain
    review_chain = SequentialChain(
        chains=[architect_chain, security_chain, product_owner_chain, devops_chain],
        input_variables=["code"],
        output_variables=["architecture_review", "security_review", "product_owner_review", "devops_review"],
        verbose=True,
    )

    return review_chain