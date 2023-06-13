import React from 'react'
import {
  Box,
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Text,
  Textarea,
  useColorModeValue,
  useMergeRefs,
  useTheme,
  VStack,
} from '@chakra-ui/react'
import { useSteps } from '@/hooks/useSteps'
import { TbCameraPlus } from 'react-icons/tb'
import { BiArrowBack, BiChevronRight, BiX } from 'react-icons/bi'
import { CameraArt, ComputerSearchArt } from '@/components/product'
import { FormProvider, SubmitErrorHandler, SubmitHandler, useForm, useFormContext } from 'react-hook-form'
import axios from 'axios'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import * as process from 'process'

const DescribeProductHero: React.FC<{ nextStep: () => void }> = ({ nextStep }) => (
  <Center height="full" width="full" textAlign="center">
    <VStack>
      <Heading as="h1" size="lg">
        Conte como é o seu produto para que todos possam encontrá-lo
      </Heading>
      <Text variant="secondary">
        Escreva um título e detalhe as características para que saibam o que você vende.
      </Text>
      <br />
      <Button width="full" onClick={nextStep}>
        Descrever Produto
      </Button>
    </VStack>
  </Center>
)

const ProductTitle: React.FC<{ nextStep: () => void }> = ({ nextStep }) => {
  const { register } = useFormContext<ProductData>()
  const [charCount, setCharCount] = React.useState(0)
  const maxCharCount = 60
  const minLength = 3

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length >= maxCharCount) {
      event.target.value = event.target.value.substring(0, maxCharCount)
    }
    setCharCount(event.target.value.length)
  }

  return (
    <VStack height="full" width="full" justifyContent="space-between">
      <FormControl>
        <FormLabel>Indique seu produto, marca e modelo</FormLabel>
        <Input
          type="text"
          placeholder="Ex: Blusa de algodão Cotton Comfort Breezy Chic"
          {...register('title', {
            required: { value: true, message: 'O título é obrigatório.'} ,
            minLength: { value: minLength, message: `O título deve ter pelo menos ${minLength} caracteres.` },
            maxLength: { value: maxCharCount, message: `O título deve ter no máximo ${maxCharCount} caracteres.` },
            onChange: handleInputChange,
          })}
        />
        <FormHelperText display="flex" justifyContent="space-between">
          <Text as="span">
            Evite incluir condições de venda
          </Text>
          <Text as="span">
            {charCount}/{maxCharCount}
          </Text>
        </FormHelperText>
      </FormControl>
      <Button width="full" onClick={nextStep} isDisabled={charCount < 3}>
        Continuar
      </Button>
    </VStack>
  )
}

type ProductCategory = {
  id: string
  name: string
}

const ProductCategory: React.FC<{ nextStep: () => void }> = ({ nextStep }) => {
  const [categories, setCategories] = React.useState<ProductCategory[]>([])
  const [searchTerms, setSearchTerms] = React.useState<string>('')
  const { setValue } = useFormContext<ProductData>()

  React.useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/product-categories?pageNumber=1&pageSize=100`)
      .then((response) => {
        if (response.status !== 200) return
        setCategories(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  const filterCategoriesBySearchTerms = (searchTerms: string): ProductCategory[] => {
    const individualTerms = searchTerms.toLowerCase().split(' ')
    if (individualTerms.length === 0) return categories
    return categories.filter((item) => {
      const lowerCaseItem = item.name.toLowerCase()
      for (const term of individualTerms) {
        if (lowerCaseItem.includes(term)) return true
      }
      return false
    })
  }

  const filteredCategories = categories.length > 0
    ? filterCategoriesBySearchTerms(searchTerms)
    : []

  const handleSelectCategory = (categoryId: string): void => {
    setValue('categoryId', categoryId)
    nextStep()
  }

  const handleChangeSearchTerms = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerms(event.target.value)
  }

  return (
    <VStack height="full" width="full">
      <FormControl>
        <FormLabel>Qual opção define o seu produto?</FormLabel>
        <Input placeholder="Buscar categoria" onChange={handleChangeSearchTerms} />
      </FormControl>
      <VStack width="full">
        {filteredCategories.map((category) => (
          <Button
            key={category.id + category.name}
            width="full"
            onClick={() => handleSelectCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </VStack>
    </VStack>
  )
}

const SelectProductCondition: React.FC<{ nextStep: () => void }> = ({ nextStep }) => {
  const { setValue } = useFormContext<ProductData>()

  const handleSelectCondition = (condition: ProductCondition): void => {
    setValue('condition', condition)
    nextStep()
  }

  return (
    <VStack height="full" width="full" justifyContent="space-between">
      <FormControl>
        <FormLabel>O seu produto é...</FormLabel>
        <VStack width="full">
            <Button width="full" onClick={() => handleSelectCondition(ProductCondition.new)}>
              Novo
            </Button>
            <Button width="full" onClick={() => handleSelectCondition(ProductCondition.used)}>
              Usado
            </Button>
            <Button width="full" onClick={() => handleSelectCondition(ProductCondition.refurbished) }>
              Recondicionado
            </Button>
        </VStack>
      </FormControl>
    </VStack>
  )
}

const ProductPicturesHero: React.FC<{ nextStep: () => void }> = ({ nextStep }) => {
  const theme = useTheme()
  const cameraArtFillColor = useColorModeValue(theme.colors.blackAlpha[900], theme.colors.whiteAlpha[800])

  return (
    <Center height="full" width="full" textAlign="center">
      <VStack gap={4} textAlign="center">
        <Box width={32} height={32}>
          <CameraArt fill={cameraArtFillColor} />
        </Box>
        <Heading as="h1">
          Adicione boas fotos do seu produto
        </Heading>
        <VStack>
          <Text variant="secondary">
            Certifique-se de que sua primeira foto tenha fundo totalmente branco com a ajuda de um editor de fotos.
          </Text>
          <Text variant="secondary">
            Não inclua banners, dados de contato, links nem referências a sites externos.
          </Text>
        </VStack>
        <Button width="full" onClick={nextStep}>
          Adicionar fotos
        </Button>
      </VStack>
    </Center>
  )
}

const ProductPictures: React.FC<{ nextStep: () => void }> = ({ nextStep }) => {
  const { register, setValue } = useFormContext<ProductData>()
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300')
  const uploadImageFieldRef = React.useRef<HTMLInputElement>(null)
  const [files, setFiles] = React.useState<File[]>([])

  const handleUploadImageClick = (): void => {
    uploadImageFieldRef.current?.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newFiles = Array.from(event.target.files || []).filter((file) => {
      for (const oldFile of files) {
        if (oldFile.name === file.name) return false
      }
      return true
    })
    setFiles([...files, ...newFiles])
  }

  const handleRemoveFile = (file: File): void => {
    const newFiles = files.filter((item) => item.name !== file.name)
    setFiles(newFiles)
  }

  React.useEffect(() => {
    setValue('pictures', files)
  }, [files, setValue])

  return (
    <VStack height="full" width="full" justifyContent="space-between">
      <Grid templateColumns="repeat(3, 1fr)" gap={4} width="full">
        {files.length === 0 && (
          <GridItem
            key={1}
            as={Button}
            variant="outline"
            width="full"
            height="full"
            style={{ aspectRatio: '1 / 1' }}
            onClick={handleUploadImageClick}
          >
            <TbCameraPlus fontSize={64}/>
          </GridItem>
        )}
        {files.map((file) => (
          <GridItem
            key={file.name}
            position="relative"
            style={{ aspectRatio: '1 / 1' }}
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderColor={borderColor}
            borderWidth={1}
            borderRadius="md"
            overflow="hidden"
          >
            <Image src={URL.createObjectURL(file)} alt={file.name} />
            <IconButton
              aria-label="Remover foto"
              position="absolute"
              top={1}
              right={1}
              onClick={() => handleRemoveFile(file)}
              icon={<BiX />}
            />
          </GridItem>
        ))}
      </Grid>
      <FormControl>
        <HStack>
          <Button width="full" onClick={handleUploadImageClick} variant="outline">
            Adicionar fotos
          </Button>
          <Button width="full" onClick={nextStep} isDisabled={files.length === 0}>
            Confirmar
          </Button>
        </HStack>
        <Input
          type="file"
          id="pictures"
          accept="image/png, image/jpeg, image/jpg"
          multiple
          hidden
          {...register('pictures', {
            validate: (pictures) => pictures.length >= 1 || 'É necessário adicionar pelo menos uma foto.',
            onChange: handleFileSelect,
          })}
          ref={useMergeRefs(uploadImageFieldRef, register('pictures').ref)}
        />
      </FormControl>
    </VStack>
  )
}

const ProductDescription: React.FC<{ nextStep: () => void }> = ({ nextStep }) => {
  const { register } = useFormContext<ProductData>()
  const [charCount, setCharCount] = React.useState(0)
  const maxCharCount = 4000
  const minLength = 16

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length >= maxCharCount) {
      event.target.value = event.target.value.substring(0, maxCharCount)
    }
    setCharCount(event.target.value.length)
  }

  return (
    <VStack height="full" width="full" justifyContent="space-between">
      <FormControl>
        <FormLabel>Descreva seu produto</FormLabel>
        <Textarea
          id="description"
          placeholder="Ex: A blusa de algodão Cotton Comfort Breezy Chic é a escolha perfeita para quem busca conforto e estilo em uma única peça de roupa. Feita com algodão de alta qualidade, essa blusa é suave e macia ao toque, proporcionando uma sensação agradável à pele."
          resize="none"
          maxLength={maxCharCount}
          noOfLines={2}
          {...register('description', {
            required: { value: true, message: 'A descrição é obrigatória.'} ,
            minLength: { value: minLength, message: `A descrição deve ter pelo menos ${minLength} caracteres.` },
            maxLength: { value: maxCharCount, message: `A descrição deve ter no máximo ${maxCharCount} caracteres.` },
            onChange: handleInputChange,
          })}
        >
        </Textarea>
        <FormHelperText display="flex" justifyContent="space-between" gap={8}>
          <Text as="span">
            Não inclua dados de contato, como e-mails, telefones, endereços, links ou referências a sites externos.
          </Text>
          <Text as="span">
            {charCount}/{maxCharCount}
          </Text>
        </FormHelperText>
      </FormControl>
      <Button width="full" onClick={nextStep} isDisabled={charCount < 3}>
        Continuar
      </Button>
    </VStack>
  )
}

const ProductPrice: React.FC<{ nextStep: () => void }> = ({ nextStep }) => {
  const {
    register,
    formState,
    trigger,
  } = useFormContext<ProductData>()
  const brlCurrency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

  const priceStringToNumber = (price: string): number => {
    return Number(price.replace(/\D/g, '')) / 100
  }

  const validatePrice = (value: string): boolean => {
    const price = priceStringToNumber(value)
    return price > 0
  }

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const price = priceStringToNumber(event.target.value)
    event.target.value = brlCurrency.format(price).replace('R$', '').trim()
  }

  const handleNextStep = async () => {
    const isValid = await trigger('price', { shouldFocus: true })
    if (isValid) nextStep()
  }

  return (
    <VStack height="full" width="full" justifyContent="space-between">
      <FormControl>
        <FormLabel>
          Preço
        </FormLabel>
        <InputGroup>
          <InputLeftAddon>
            R$
          </InputLeftAddon>
          <Input
            id="price"
            type="text"
            inputMode="numeric"
            min={0}
            step={0.01}
            placeholder="Ex: 100,00"
            {...register('price', {
              required: { value: true, message: 'O preço é obrigatório.' },
              validate: validatePrice,
              onChange: handleChangeInput,
            })}
          />
        </InputGroup>
        <FormHelperText>
          { formState.errors.price && formState.errors.price.type === 'validate' && 'O preço deve ser maior que zero.' }
        </FormHelperText>
      </FormControl>
      <Button width="full" onClick={handleNextStep}>
        Continuar
      </Button>
    </VStack>
  )
}

const SelectProductWarrantyType: React.FC<{ nextStep: () => void }> = ({ nextStep }) => {
  const { getValues, setValue } = useFormContext<ProductData>()

  const handleSelectWarrantyType = (warrantyType: ProductWarrantyType) => {
    setValue('warranty', {
      ...getValues().warranty,
      type: warrantyType
    })
    if (warrantyType === ProductWarrantyType.none) nextStep()
    nextStep()
  }

  return (
    <VStack height="full" width="full" justifyContent="space-between">
      <FormControl>
        <FormLabel>Você oferece garantia?</FormLabel>
        <VStack width="full">
          <Button width="full" onClick={() => handleSelectWarrantyType(ProductWarrantyType.seller)}>
            Garantia do vendedor
          </Button>
          <Button width="full" onClick={() => handleSelectWarrantyType(ProductWarrantyType.manufacturer)}>
            Garantia de fábrica
          </Button>
          <Button width="full" onClick={() => handleSelectWarrantyType(ProductWarrantyType.none)}>
            Sem garantia
          </Button>
        </VStack>
      </FormControl>
    </VStack>
  )
}

const ProductWarranty: React.FC<{ nextStep: () => void }> = ({ nextStep }) => {
  const {
    register,
    setValue,
    getValues,
    trigger,
    formState: { errors }
  } = useFormContext<ProductData>()

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue('warranty', {
      ...getValues().warranty,
      duration: {
        ...getValues().warranty.duration,
        time: Number(event.target.value)
      }
    })
  }

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue('warranty', {
      ...getValues().warranty,
      duration: {
        ...getValues().warranty.duration,
        unit: event.target.value as ProductWarrantyDurationUnit
      }
    })
  }

  const handleNextStep = async () => {
    const isValid = await trigger('warranty.duration.time', { shouldFocus: true })
    if (isValid) nextStep()
  }

  return (
    <VStack height="full" width="full" justifyContent="space-between">
      <FormControl>
        <FormLabel>Quanto tempo de garantia você oferece?</FormLabel>
        <InputGroup gap={4}>
          <Input
            id="warranty"
            type="number"
            min={0}
            step={1}
            placeholder="Ex: 12"
            flex={3}
            {...register('warranty.duration.time', {
              min: { value: 1, message: 'A duração da garantia deve ser maior que 0.' },
              onChange: handleChangeInput,
            })}
          />
          <Select
            flex={2}
            defaultValue={ProductWarrantyDurationUnit.months}
            {...register('warranty.duration.unit', {
              onChange: handleChangeSelect,
            })}
          >
            <option value={ProductWarrantyDurationUnit.days}>Dias</option>
            <option value={ProductWarrantyDurationUnit.months}>Meses</option>
            <option value={ProductWarrantyDurationUnit.years}>Anos</option>
          </Select>
        </InputGroup>
        <FormHelperText>
          { errors.warranty?.duration?.time && errors.warranty.duration.time.message }
        </FormHelperText>
      </FormControl>
      <Button
        width="full"
        onClick={handleNextStep}
      >
        Continuar
      </Button>
    </VStack>
  )
}

const ReviewProductHero: React.FC<{ nextStep: () => void }> = ({ nextStep }) => {
  const theme = useTheme()
  const cameraArtFillColor = useColorModeValue(theme.colors.blackAlpha[900], theme.colors.whiteAlpha[800])

  return (
    <Center>
      <VStack gap={4} textAlign="center">
        <Box width={32} height={32}>
          <ComputerSearchArt fill={cameraArtFillColor} />
        </Box>
        <Heading as="h1">
          Você está prestes a anunciar
        </Heading>
        <VStack>
          <Text variant="secondary">
            Revise a informação. Se quiser ainda dá tempo de fazer alterações.
          </Text>
        </VStack>
        <Button width="full" onClick={nextStep}>
          Revisar anúncio
        </Button>
      </VStack>
    </Center>
  )
}

const ReviewProductLine: React.FC<{ title: React.ReactNode, description: React.ReactNode, onClick: () => void }> = ({ title, description, onClick }) => {
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300')

  return (
    <HStack
      width="full"
      justifyContent="space-between"
      borderBottomColor={borderColor}
      borderBottomWidth={1}
      paddingY={4}
      onClick={onClick}
    >
      <VStack alignItems="flex-start" width="calc(var(--chakra-sizes-full) - var(--chakra-sizes-12))">
        <Text variant="secondary" fontSize="sm" marginBottom={2}>
          { title }
        </Text>
        <Box width="full">
          { description }
        </Box>
      </VStack>
      <Box width={12}>
        <BiChevronRight size={24} />
      </Box>
    </HStack>
  )
}

const ReviewProduct: React.FC<{ nextStep: () => void, setStep: (step: number) => void }> = ({ setStep }) => {
  const { getValues } = useFormContext<ProductData>()
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300')

  const formatDurationUnit = (durationUnit: ProductWarrantyDurationUnit): string => {
    switch (durationUnit) {
      case ProductWarrantyDurationUnit.days:
        return 'Dias'
      case ProductWarrantyDurationUnit.months:
        return 'Meses'
      case ProductWarrantyDurationUnit.years:
        return 'Anos'
    }
  }

  const formatCondition = (condition: ProductCondition): string => {
    switch (condition) {
      case ProductCondition.new:
        return 'Novo'
      case ProductCondition.used:
        return 'Usado'
      case ProductCondition.refurbished:
        return 'Recondicionado'
    }
  }

  return (
    <VStack height="full" width="full" justifyContent="space-between">
      <Heading as="h1">
        Revise e anuncie
      </Heading>
      <VStack width="full">
        <ReviewProductLine
          title="Fotos"
          description={(
            <Box width="full" position="relative">
              <Box overflowX="auto" paddingEnd={24}>
                <HStack minWidth="min-content">
                  {getValues().pictures?.map((file) => {
                    return (
                      <Center
                        key={file.name}
                        width={24}
                        height={24}
                        borderColor={borderColor}
                        borderWidth={1}
                        borderRadius="md"
                        overflow="hidden"
                      >
                        <Image src={URL.createObjectURL(file)} alt={file.name} />
                      </Center>
                    )
                  })}
                </HStack>
                <Box
                  position="absolute"
                  backgroundImage="linear-gradient(to right, transparent, var(--chakra-colors-chakra-body-bg))"
                  top={0}
                  right={0}
                  width={24}
                  height={24}
                  pointerEvents="none"
                />
              </Box>
            </Box>
          )}
          onClick={() => setStep(6)}
        />
        <ReviewProductLine
          title="Título"
          description={(
            <Text textOverflow="ellipsis" noOfLines={1}>
              {getValues().title}
            </Text>
          )}
          onClick={() => setStep(2)}
        />
        <ReviewProductLine
          title="Preço"
          description={`R$ ${getValues().price}`}
          onClick={() => setStep(3)}
        />
        <ReviewProductLine
          title="Descrição"
          description={(
            <Text textOverflow="ellipsis" noOfLines={2}>
              {getValues().description}
            </Text>
          )}
          onClick={() => setStep(7)}
        />
        <ReviewProductLine
          title="Garantia"
          description={`${getValues().warranty?.duration?.time} ${formatDurationUnit(getValues().warranty?.duration?.unit)}`}
          onClick={() => setStep(8)}
        />
        <ReviewProductLine
          title="Condição"
          description={formatCondition(getValues().condition)}
          onClick={() => setStep(4)}
        />
      </VStack>
      <Box width="full" paddingY={8}>
        <Button
          width="full"
          type="submit"
          ref={buttonRef}
        >
          Anunciar
        </Button>
      </Box>
    </VStack>
  )
}

const steps = [
  { id: 1, label: 'Passo 1', Content: DescribeProductHero },
  { id: 2, label: 'Passo 2', Content: ProductTitle },
  { id: 3, label: 'Passo 3', Content: ProductCategory },
  { id: 4, label: 'Passo 4', Content: SelectProductCondition },
  { id: 5, label: 'Passo 5', Content: ProductPicturesHero },
  { id: 6, label: 'Passo 6', Content: ProductPictures },
  { id: 7, label: 'Passo 7', Content: ProductDescription },
  { id: 8, label: 'Passo 8', Content: ProductPrice },
  { id: 9, label: 'Passo 9', Content: SelectProductWarrantyType },
  { id: 10, label: 'Passo 10', Content: ProductWarranty },
  { id: 11, label: 'Passo 11', Content: ReviewProductHero },
  { id: 12, label: 'Passo 12', Content: ReviewProduct },
]

enum ProductWarrantyType {
  seller = 'SELLER',
  manufacturer = 'MANUFACTURER',
  none = 'NONE',
}

enum ProductWarrantyDurationUnit {
  days = 'DAYS',
  months = 'MONTHS',
  years = 'YEARS',
}

enum ProductCondition {
  new = 'NEW',
  used = 'USED',
  refurbished = 'REFURBISHED',
}

type ProductData = {
  title: string
  description: string
  price: string
  warranty: {
    type: ProductWarrantyType
    duration: {
      time: number
      unit: ProductWarrantyDurationUnit
    }
  }
  condition: ProductCondition
  categoryId: string
  pictures: File[]
}

const AddProductPage: React.FC = () => {
  const session = useSession()
  const formMethods = useForm<ProductData>()
  const {
    activeStep,
    nextStep,
    setStep,
  } = useSteps({
    initialStep: 1,
    maxSteps: steps.length,
  })

  const handleAddProduct: SubmitHandler<ProductData> = async (productData: ProductData): Promise<void> => {
    const formData = new FormData()
    formData.append('title', productData.title)
    formData.append('description', productData.description)
    const cleanPrice = productData.price.replace(',', '.').replace(/\D/g, '')
    formData.append('priceInCents', String(String(Number(cleanPrice) * 100)))
    formData.append('warrantyType', productData.warranty.type)
    formData.append('warrantyDurationTime', String(productData.warranty.duration.time))
    formData.append('warrantyDurationUnit', productData.warranty.duration.unit)
    formData.append('condition', productData.condition)
    formData.append('categoryId', productData.categoryId)
    productData.pictures.forEach((picture) => {
      formData.append('pictures', picture)
    })
    try {
      const { status } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${session.data?.accessToken}`,
        },
      })
      if (status !== 204) return window.alert('Erro ao anunciar produto!')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        for (const responseError of error.response?.data?.errors || []) {
          window.alert(responseError?.message || 'Erro ao anunciar produto!')
        }
        return
      }
    }
    window.alert('Produto anunciado com sucesso!')
    window.location.href = '/'
  }

  const handleInvalidAddProduct: SubmitErrorHandler<ProductData> = (errors) => {
    const keys = Object.keys(errors) as (keyof ProductData)[]
    keys.forEach((key) => {
      if (errors[key]?.message) window.alert(errors[key]?.message)
    })
  }

  return (
    <VStack
      height="calc(100vh - 57px)"
      overflowY="auto"
      position="relative"
    >
      <Head>
        <title>Anunciar Produto</title>
      </Head>
      <Box
        as="nav"
        boxShadow="sm"
        width="full"
        padding={4}
        position="sticky"
      >
        <HStack spacing="10" justify="space-between">
          <IconButton aria-label="go-back" onClick={() => window.history.back()}>
            <BiArrowBack />
          </IconButton>
        </HStack>
      </Box>
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(handleAddProduct, handleInvalidAddProduct)}
          style={{ width: '100%', height: '100%' }}
        >
          {steps.map(({ label, Content }, index) => (
            <Box
              key={label}
              height="full"
              width="full"
              padding={4}
              display={index + 1 === activeStep ? 'flex' : 'none'}
            >
              <Content nextStep={nextStep} setStep={setStep} />
            </Box>
          ))}
        </form>
      </FormProvider>
    </VStack>
  )
}

export default AddProductPage
